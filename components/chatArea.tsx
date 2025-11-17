import { ScrollView, StyleSheet } from "react-native";
import ChatBubble from "./MessageBubble";
import userAvatar from "../assets/images/user.png";
import botAvatar from "../assets/images/bot.png";
import type { ImageSourcePropType } from "react-native";

export type ChatMessage = {
  id: string | number;
  text: string;
  time: string;
  side: "left" | "right";
  avatar?: ImageSourcePropType;
};

type ChatAreaProps = {
  messages: ChatMessage[];
};

export default function ChatArea({ messages }: ChatAreaProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg) => {
        const avatar =
          msg.avatar ??
          (msg.side === "right" ? userAvatar : botAvatar);

        return (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            time={msg.time}
            side={msg.side}
            avatar={avatar}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 10,
    paddingBottom: 32, // folga pro final não sumir atrás da navbar
  },
});
