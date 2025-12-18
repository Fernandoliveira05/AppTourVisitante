// app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import Logo from "../../assets/images/logo-branca.png";
import ChatArea, { ChatMessage } from "../../components/chatArea";
import VoiceButton from "../../components/VoiceButton";

import { useTour } from "@/context/TourContext";
import {
  getHistoricoChat,
  getRespostaByPerguntaId,
  askModelo,
  Pergunta,
  Resposta,
} from "@/api/chatService";

const BG = "#1E1730";

export default function Home() {
  const { tourId: tourIdParam } = useLocalSearchParams<{ tourId?: string }>();
  const { tour } = useTour();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0); // ✅

  const numericTourId: number | null =
    tour?.tourId ?? (tourIdParam ? Number(tourIdParam) : null);

  const numericCheckpointId: number | null = tour?.checkpointId ?? 4;

  const formatTime = (iso: string | null | undefined) => {
    if (!iso) {
      return new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!numericTourId) return;

        const historico: Pergunta[] = await getHistoricoChat();
        const msgs: ChatMessage[] = [];

        msgs.push({
          id: "welcome",
          text: "Oi! Eu sou a LIA! Tem alguma dúvida sobre o",
          time: getCurrentTime(),
          side: "left",
          renderMarkdown: true,
        });

        const perguntasDoTourAtual = historico.filter(
          (p) => p.tour_id === numericTourId
        );

        for (const pergunta of perguntasDoTourAtual) {
          msgs.push({
            id: `q-${pergunta.id}`,
            text: pergunta.texto,
            time: formatTime(pergunta.criado_em),
            side: "right",
          });

          try {
            const resposta: Resposta | null = await getRespostaByPerguntaId(
              pergunta.id
            );

            if (resposta) {
              msgs.push({
                id: `r-${resposta.id}`,
                text: resposta.texto,
                time: formatTime(resposta.criado_em),
                side: "left",
                renderMarkdown: true,
              });
            } else {
              msgs.push({
                id: `r-pending-${pergunta.id}`,
                text: "Essa pergunta ainda não foi respondida pela LIA.",
                time: formatTime(null),
                side: "left",
                status: "pending",
              });
            }
          } catch (err) {
            msgs.push({
              id: `r-error-${pergunta.id}`,
              text: "Erro ao carregar resposta.",
              time: formatTime(null),
              side: "left",
              status: "error",
            });
          }
        }

        setMessages(msgs);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };

    loadHistory();
  }, [numericTourId]);

  const sendQuestionToBackend = async (userText: string) => {
    try {
      if (!numericTourId) return;
      let checkpointIdToUse: number | null = numericCheckpointId;

      if (!checkpointIdToUse) {
        const historico = await getHistoricoChat();
        const perguntas = historico.filter((p) => p.tour_id === numericTourId);
        if (perguntas.length > 0) {
          checkpointIdToUse = perguntas[perguntas.length - 1].checkpoint_id;
        }
      }

      if (!checkpointIdToUse) return;

      const resposta = await askModelo({
        tour_id: numericTourId,
        checkpoint_id: checkpointIdToUse,
        question_topic: null,
        texto: userText,
        estado: "queued",
        liberado_em: null,
        respondido_em: null,
      });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: resposta.texto,
        time: formatTime(resposta.criado_em),
        side: "left",
        renderMarkdown: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro backend:", error);
    }
  };

  const handleSendText = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      time: getCurrentTime(),
      side: "right",
    };
    setMessages((prev) => [...prev, userMessage]);
    sendQuestionToBackend(text);
  };

  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <Image source={Logo} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.body}>
              <View style={styles.leftPane}>
                <ChatArea messages={messages} />
              </View>

              <View style={styles.rightPane}>
                <VoiceButton onSendText={handleSendText} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.body}>
            <View style={styles.leftPane}>
              <ChatArea messages={messages} />
            </View>

            <View style={styles.rightPane}>
              <VoiceButton onSendText={handleSendText} />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  inner: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 100,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leftPane: {
    flex: 1.5,
    marginRight: 12,
  },
  rightPane: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
