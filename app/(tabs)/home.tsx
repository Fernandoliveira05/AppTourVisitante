import React from "react";
import { Image, View, StyleSheet } from "react-native";
import Logo from "../../assets/images/logo-branca.png";
import { usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatArea, { ChatMessage } from "../../components/chatArea";
import VoiceButton from "../../components/VoiceButton";
import Navbar from "@/components/navbar";

// Por enquanto, só um mock. Depois você troca por dados reais (API, etc.).
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "Como funcionam as notas por aqui?",
    time: "13:47",
    side: "right",
  },
  {
    id: "2",
    text: "Olha, funciona assim: o sistema de avaliação dos alunos... ele é composto por três elementos...",
    time: "13:47",
    side: "left",
  },
];

export default function Home() {
  const pathname = usePathname();
  
  return (
    <>
    <StatusBar hidden />
    <View style={styles.container}>
      {/* Cabeçalho com logo */}
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Corpo dividido em dois: esquerda chat, direita mic grande */}
      <View style={styles.body}>
        <View style={styles.leftPane}>
          <ChatArea messages={MOCK_MESSAGES} />
        </View>

        <View style={styles.rightPane}>
          <View style={styles.micWrapper}>
            <VoiceButton />
          </View>
        </View>
      </View>

      {/* Navbar embaixo */}
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
  body: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  leftPane: {
    flex: 1,
    marginRight: 12,
  },
  rightPane: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micWrapper: {
    transform: [{ scale: 1.6 }],
  },
});
