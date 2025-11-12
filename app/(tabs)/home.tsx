import { Image, View, StyleSheet } from "react-native";
import Logo from "../../assets/images/logo-branca.png";
import ChatArea from "../../components/chatArea";
import VoiceButton from "../../components/VoiceButton";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <ChatArea />
      <VoiceButton />
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
});
