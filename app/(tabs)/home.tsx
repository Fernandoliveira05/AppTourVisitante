// app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Logo from "../../assets/images/logo-branca.png";
import ChatArea, { ChatMessage } from "../../components/chatArea";
import VoiceButton from "../../components/VoiceButton";
import Navbar from "@/components/navbar";

import { useTour } from "@/context/TourContext";
import {
  createPergunta,
  getRespostaByPerguntaId,
  getHistoricoChat,
  Pergunta,
} from "@/api/chatService";

export default function Home() {
  const { tourId: tourIdParam } = useLocalSearchParams<{ tourId?: string }>();

  const { tour } = useTour();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const numericTourId: number | null =
    tour?.tourId ?? (tourIdParam ? Number(tourIdParam) : null);

  const numericCheckpointId: number | null = tour?.checkpointId ?? null;

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
    const loadHistory = async () => {
      try {
        if (!numericTourId) {
          console.log("⚠️ [CHAT] Sem tourId ainda, não dá pra carregar histórico.");
          return;
        }

        console.log("📜 [CHAT] Carregando histórico bruto (todas as perguntas)...");
        const historico: Pergunta[] = await getHistoricoChat();

        const msgs: ChatMessage[] = [];

        msgs.push({
          id: "welcome",
          text: "Oi! Eu sou seu assistente do Inteli. Como posso te ajudar hoje?",
          time: getCurrentTime(),
          side: "left",
        });

        const perguntasDoTourAtual = historico.filter(
          (p) => p.tour_id === numericTourId
        );

        console.log(
          `📌 [CHAT] Encontradas ${perguntasDoTourAtual.length} perguntas do tour ${numericTourId}`
        );

        for (const pergunta of perguntasDoTourAtual) {
          msgs.push({
            id: `q-${pergunta.id}`,
            text: pergunta.texto,
            time: formatTime(pergunta.criado_em),
            side: "right",
          });

          // try {
          //   const resposta = await getRespostaByPerguntaId(pergunta.id);
          //   if (resposta) {
          //     msgs.push({
          //       id: `r-${resposta.id}`,
          //       text: resposta.texto,
          //       time: formatTime(resposta.criado_em),
          //       side: "left",
          //     });
          //   }
          // } catch (err) {
          //   console.log(
          //     `⚠️ [CHAT] Erro ao buscar resposta da pergunta ${pergunta.id}:`,
          //     err
          //   );
          // }
        }

        setMessages(msgs);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);

        setMessages([
          {
            id: "error-load",
            text:
              "Não consegui carregar o histórico agora, mas você já pode me enviar perguntas normalmente.",
            time: getCurrentTime(),
            side: "left",
          },
        ]);
      }
    };

    loadHistory();
  }, [numericTourId]);

  const sendQuestionToBackend = async (userText: string) => {
    try {
      console.log("🚀 [CHAT] Enviando pergunta com:", {
        tourId: numericTourId,
        checkpointId: numericCheckpointId,
      });

      if (!numericTourId || !numericCheckpointId) {
        const errorMessage: ChatMessage = {
          id: `no-tour-${Date.now()}`,
          text:
            "Não encontrei o tour ou o checkpoint atual. Volte à tela inicial e entre novamente com o código, por favor.",
          time: getCurrentTime(),
          side: "left",
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const pergunta = await createPergunta({
        texto: userText,
        checkpoint_id: numericCheckpointId,
        question_topic: null,
        estado: "queued",
        tour_id: numericTourId,
      });

      // const resposta = await getRespostaByPerguntaId(pergunta.id);

      // if (!resposta) {
      //   console.log(
      //     `⌛ [CHAT] Pergunta ${pergunta.id} ainda não possui resposta no backend.`
      //   );
      //   return;
      // }

      // const botMessage: ChatMessage = {
      //   id: `bot-${Date.now()}`,
      //   text: resposta.texto,
      //   time: getCurrentTime(),
      //   side: "left",
      // };

      // setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao falar com o backend:", error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text:
          "Tive um problema para falar com o servidor agora. Pode tentar de novo daqui a pouco? 🙏",
        time: getCurrentTime(),
        side: "left",
      };

      setMessages((prev) => [...prev, errorMessage]);
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
