import Navbar from "@/components/navbar";
import { useTour } from "@/context/TourContext";
import { alertService } from "@/services/alertService";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Logo = require("../../assets/images/logo-branca.png");
const AlertButton = require("../../assets/images/alert-button.png");

export default function Emergencia() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);
  const { tour } = useTour();

  const handleAlertPress = async () => {
    // Animação de pressão
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Confirmar acionamento da emergência
    Alert.alert(
      "🚨 Confirmar Emergência",
      "Você tem certeza que deseja acionar a emergência? A equipe Inteli será notificada imediatamente.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, acionar",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            
            try {
              console.log("🚨 Acionando emergência...");
              console.log("Tour ID:", tour?.tourId);

              // Chama a API para criar o alerta
              const alert = await alertService.triggerEmergency(
                tour?.tourId ?? null,
                "Emergência acionada pelo visitante através do aplicativo"
              );

              console.log("✅ Emergência acionada com sucesso:", alert);

              // Notifica o usuário
              Alert.alert(
                "✅ Emergência Acionada",
                "A equipe Inteli foi notificada e prestará auxílio em breve. Aguarde no local.",
                [
                  {
                    text: "OK",
                    onPress: () => console.log("Emergência confirmada pelo usuário"),
                  },
                ]
              );
            } catch (error: any) {
              console.error("❌ Erro ao acionar emergência:", error);

              Alert.alert(
                "❌ Erro",
                "Não foi possível acionar a emergência. Por favor, procure um funcionário do Inteli imediatamente.",
                [{ text: "OK" }]
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Logo do Inteli no topo */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Conteúdo central */}
        <View style={styles.content}>
          {/* Círculo roxo claro com botão vermelho */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleAlertPress}
            disabled={isLoading}
          >
            <Animated.View 
              style={[
                styles.buttonCircle,
                { transform: [{ scale: scaleAnim }] },
                isLoading && styles.buttonDisabled
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Image source={AlertButton} style={styles.alertButton} resizeMode="contain" />
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.title}>
            {isLoading ? "ACIONANDO EMERGÊNCIA..." : "DESEJA SOLICITAR A EMERGÊNCIA?"}
          </Text>

          {/* Texto explicativo */}
          <Text style={styles.description}>
            {isLoading 
              ? "Aguarde, estamos notificando a equipe Inteli..."
              : "Ao clicar neste ícone, o tour será interrompido e a equipe Inteli será acionada"
            }
          </Text>
        </View>

        {/* Navbar */}
        <Navbar />
      </View>
    </>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 60, // Espaço para a navbar
    marginTop: -40, // Move o conteúdo para cima
  },
  buttonCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#6440C4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  alertButton: {
    width: 180,
    height: 180,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  description: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 28,
    opacity: 0.95,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
});
