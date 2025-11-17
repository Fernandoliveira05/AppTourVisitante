import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BARS_COUNT = 24;
const MIN_HEIGHT = 6;
const MAX_EXTRA_HEIGHT = 50;

const BAR_CONFIGS = Array.from({ length: BARS_COUNT }, (_, i) => {
  const t = i / (BARS_COUNT - 1); 
  const base = Math.sin(t * Math.PI); 
  return {
    base, 
    delay: i * 60,
  };
});

// Componente da wave estilo Siri
function SiriWaveform({ level }: { level: number }) {
  const barAnims = useRef(
    BAR_CONFIGS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    barAnims.forEach((anim, index) => {
      const { delay } = BAR_CONFIGS[index];

      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [barAnims]);

  return (
    <View style={styles.waveformContainer}>
      {barAnims.map((anim, index) => {
        const cfg = BAR_CONFIGS[index];

        const height =
          MIN_HEIGHT +
          cfg.base * MAX_EXTRA_HEIGHT * (0.3 + level * 0.7);

        const scaleY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1.1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height,
                transform: [{ scaleY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export default function VoiceButton() {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLevel(Math.random());
    }, 120);

    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="mic-outline" size={38} color="#fff" />
      </TouchableOpacity>
      <View style={styles.waveWrapper}>
        <SiriWaveform level={level} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  waveWrapper: {
    marginTop: 18,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: MAX_EXTRA_HEIGHT + MIN_HEIGHT,
  },
  waveBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 999,
    backgroundColor: "#9B6DFF", 
  },
});
