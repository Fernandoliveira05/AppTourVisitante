import { View, Text, StyleSheet, Image } from "react-native";

export default function ChatBubble({ text, time, side = "left", avatar }: any) {
  const isUser = side === "right";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.rightContainer : styles.leftContainer,
      ]}
    >
      {!isUser && avatar && (
        <Image source={avatar} style={styles.avatar} />
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.text}>{text}</Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>

      {isUser && avatar && (
        <Image source={avatar} style={styles.avatar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  leftContainer: {
    justifyContent: "flex-start",
  },
  rightContainer: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    padding: 10,
  },
  botBubble: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#6A40C4",
    borderBottomRightRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  time: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
