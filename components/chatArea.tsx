import { ScrollView, StyleSheet } from "react-native";
import ChatBubble from "./MessageBubble";
import userAvatar from "../assets/images/user.png";
import botAvatar from "../assets/images/bot.png";

export default function ChatArea() {
  return (
    <ScrollView style={styles.container}>
      <ChatBubble
        text="Como funcionam as notas por aqui?"
        time="13:47"
        side="right"
        avatar={userAvatar}
      />
      <ChatBubble
        text="Olha, funciona assim: o sistema de avaliação dos alunos... ele é composto por três elementos..."
        time="13:47"
        side="left"
        avatar={botAvatar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
});
