import { View, Text, Image, StyleSheet } from "react-native";

export default function CardTutorial({ text, image }) {
  return (
    <View style={styles.content}>
      <Text style={styles.text}>{text}</Text>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  image: {
    width: 90,
    height: 90,
  },
});
