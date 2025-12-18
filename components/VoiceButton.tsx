import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  TextInput,
  type TextInput as RNTextInput,
  Alert,
  ActivityIndicator, // Indicador de carregamento nativo
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio, type RecordingStatus, type Recording } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

const STT_WS_URL = "ws://10.140.0.11:5000/stt";

const BARS_COUNT = 24;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 45;

const BAR_CONFIGS = Array.from({ length: BARS_COUNT }, (_, i) => {
  const t = i / (BARS_COUNT - 1);
  const base = Math.sin(t * Math.PI); 
  return { base, delay: i * 50 };
});

function SiriWaveform({ audioLevel }: { audioLevel: Animated.Value }) {
  const barAnims = useRef(BAR_CONFIGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    barAnims.forEach((anim, index) => {
      const { delay } = BAR_CONFIGS[index];
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.waveformContainer}>
      {barAnims.map((loopAnim, index) => {
        const cfg = BAR_CONFIGS[index];
        const dynamicHeight = Animated.multiply(loopAnim, audioLevel).interpolate({
          inputRange: [0, 1],
          outputRange: [MIN_HEIGHT, MIN_HEIGHT + (cfg.base * MAX_HEIGHT)],
        });

        return (
          <Animated.View
            key={index}
            style={[styles.waveBar, { height: dynamicHeight }]}
          />
        );
      })}
    </View>
  );
}

type InputMode = "voice" | "text";

type VoiceButtonProps = {
  onSendText?: (text: string) => void;
};

export default function VoiceButton({ onSendText }: VoiceButtonProps) {
  const audioLevel = useRef(new Animated.Value(0)).current; 
  const recordingRef = useRef<Recording | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [text, setText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const inputRef = useRef<RNTextInput | null>(null);
  const modeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const animateMode = (toValue: 0 | 1) => {
    Animated.timing(modeAnim, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const startRecording = async () => {
    if (hasPermission === false) {
      Alert.alert("Permissão negada", "Ative o microfone nas configurações.");
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        }
      };

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status: RecordingStatus) => {
          if (!status.isRecording) return;
          const anyStatus = status as any;
          const metering = anyStatus.metering;

          if (typeof metering === "number") {
            const minDb = -60;
            const clamped = Math.max(metering, minDb);
            const normalized = (clamped - minDb) / -minDb;
            
            Animated.timing(audioLevel, {
                toValue: Math.pow(normalized, 1.5) * 1.5,
                duration: 100,
                useNativeDriver: false,
            }).start();
          } else {
            Animated.timing(audioLevel, {
                toValue: Math.random() * 0.5 + 0.2,
                duration: 100,
                useNativeDriver: false,
            }).start();
          }
        },
        100
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      console.error("Erro ao iniciar gravação:", e);
    }
  };

  const transcribeAudio = async (uri: string): Promise<string | null> => {
    try {
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64" as any,
      });

      console.log("📦 Enviando áudio...");

      return new Promise<string | null>((resolve, reject) => {
        try {
          const ws = new WebSocket(STT_WS_URL);
          ws.onopen = () => ws.send(base64Audio);
          ws.onmessage = (event) => {
            const msg = String(event.data || "").trim();
            ws.close();
            resolve(msg || null);
          };
          ws.onerror = (event) => {
            ws.close();
            reject(new Error("Erro WebSocket"));
          };
        } catch (err) {
          reject(err);
        }
      });
    } catch (e) {
      console.error("Erro transcribe:", e);
      return null;
    }
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    // --- UI OTIMISTA ---
    setIsRecording(false);
    setIsTranscribing(true); // Ativa o loading
    Animated.timing(audioLevel, { toValue: 0, duration: 200, useNativeDriver: false }).start();

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri && onSendText) {
        const transcript = await transcribeAudio(uri);
        setIsTranscribing(false); // Para o loading

        if (transcript && transcript.trim().length > 0) {
          onSendText(transcript.trim());
        }
      } else {
        setIsTranscribing(false);
      }
    } catch (e) {
      console.warn("Erro stop:", e);
      setIsRecording(false);
      setIsTranscribing(false);
    } finally {
      recordingRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isTranscribing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleMainPress = () => {
    if (inputMode === "voice") {
      toggleRecording();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleModeToggle = () => {
    if (inputMode === "voice") {
      if (isRecording) stopRecording();
      setInputMode("text");
      animateMode(1);
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      setInputMode("voice");
      animateMode(0);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (onSendText) onSendText(trimmed);
    setText("");
  };

  const micIconStyle = {
    opacity: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{
        translateY: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] })
    }],
  };

  const textIconStyle = {
    opacity: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    transform: [{
        translateY: modeAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] })
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchWrapper}>
        <Animated.View style={styles.modeToggleWrapper}>
          <TouchableOpacity
            style={[
              styles.modeToggle,
              inputMode === "text" && styles.modeToggleActive,
            ]}
            onPress={handleModeToggle}
            disabled={isTranscribing || isRecording}
          >
            <Ionicons
              name={inputMode === "voice" ? "text-outline" : "mic-outline"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.button,
            isRecording && { borderColor: '#FF4B4B' }
          ]}
          onPress={handleMainPress}
          disabled={isTranscribing}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.iconLayer, micIconStyle]}>
            <Ionicons
              name={isRecording ? "arrow-up" : "mic-outline"}
              size={isRecording ? 38 : 38}
              color="#fff"
            />
          </Animated.View>

          <Animated.View style={[styles.iconLayer, textIconStyle]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={34}
              color="#fff"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* ÁREA DE FEEDBACK (ONDAS OU LOADING) */}
      <View style={styles.feedbackArea}>
        
        {/* Mostra Ondas SE estiver gravando E NÃO estiver processando */}
        {inputMode === "voice" && isRecording && !isTranscribing && (
          <SiriWaveform audioLevel={audioLevel} />
        )}

        {/* Mostra Loading APENAS se estiver processando */}
        {isTranscribing && (
          <ActivityIndicator size="small" color="#C7C1E0" />
        )}
      </View>

      {/* INPUT DE TEXTO */}
      {inputMode === "text" && (
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#C7C1E0"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.6 }], 
  },
  switchWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6A40C4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  iconLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modeToggleWrapper: {
    position: "absolute",
    right: -12,
    bottom: -10,
    zIndex: 10, 
  },
  modeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4D2AA8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  modeToggleActive: {
    backgroundColor: "#7A52FF",
  },
  
  // CONTAINER PARA ONDAS E LOADING (Mantém a posição fixa)
  feedbackArea: {
    marginTop: 30,
    height: MAX_HEIGHT + MIN_HEIGHT, // Altura fixa para não pular
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: '100%',
  },
  waveBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 999,
    backgroundColor: "#9B6DFF",
  },
  inputWrapper: {
    marginTop: 18,
    flexDirection: "row",
    width: 300,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(38, 26, 92, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    paddingVertical: 0,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});