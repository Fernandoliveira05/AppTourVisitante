// app/(tabs)/home.tsx
import React, { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import Logo from "../../assets/images/logo-branca.png";
import ChatArea, { ChatMessage } from "../../components/chatArea";
import VoiceButton from "../../components/VoiceButton";
import Navbar from "@/components/navbar";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Oi! Eu sou seu assistente do Inteli. Como posso te ajudar hoje?",
      time: "13:47",
      side: "left",
    },
  ]);

  const handleSendText = (text: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      time,
      side: "right",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <View style={styles.container}>
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

      <Navbar />
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
