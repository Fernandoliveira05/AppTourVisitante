import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/images/logo-branca.png";
import CardTutorial from "../../components/card_tutorial";

export default function Home() {
  const router = useRouter();

  const steps = [
    {
      text: "Em casos de emergência, você pode solicitar ajuda através desse mesmo aplicativo.",
      image: require("../../assets/images/botao_emergencia.png"),
    },
    {
      text: "Certifique-se de estar conectado à internet para enviar o pedido de ajuda.",
      image: require("../../assets/images/botao_emergencia.png"),
    },
    {
      text: "Nossa equipe responderá o mais rápido possível.",
      image: require("../../assets/images/botao_emergencia.png"),
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/(tabs)/home");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Tutorial</Text>

          <CardTutorial
            text={steps[currentStep].text}
            image={steps[currentStep].image}
          />

          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={handlePrev}
              disabled={currentStep === 0}
            >
              <BlurView
                intensity={40}
                tint="dark"
                style={[
                  styles.blurBackground,
                  currentStep === 0 && styles.disabled,
                ]}
              >
                <Text style={styles.arrow}>◀</Text>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.glassButton} onPress={handleNext}>
              <BlurView
                intensity={40}
                tint="dark"
                style={[
                  styles.blurBackground,
                  currentStep === steps.length - 1 && styles.finished,
                ]}
              >
                <Text style={styles.arrow}>
                  {currentStep === steps.length - 1 ? "✔" : "▶"}
                </Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1730",
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 23, 48, 0.9)", // base do "liquid glass"
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(30, 23, 48, 0.9)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 30,
  },
  glassButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    overflow: "hidden",
  },
  blurBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 27.5,
    backgroundColor: "rgba(30, 23, 48, 0.6)", // igual ao overlay
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  arrow: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.4,
  },
  finished: {
    borderColor: "rgba(0,255,0,0.4)",
    backgroundColor: "rgba(0,255,0,0.15)",
  },
});
