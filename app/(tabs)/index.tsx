import { Image } from "expo-image";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFonts } from "@expo-google-fonts/manrope/useFonts";
import { usePathname, router } from "expo-router";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { useState } from "react";
import Casinhas from "../../assets/images/Login/Casinhas.jpg";
import Auditorio from "../../assets/images/Login/Auditório.jpg";
import Frente from "../../assets/images/Login/Frente.jpg";
import Letreiro from "../../assets/images/Login/Letreiro.jpeg";
import Pessoas from "../../assets/images/Login/Pessoas.jpeg";
import Refeitorio from "../../assets/images/Login/Refeitorio.jpg";
import Logo from "../../assets/images/logo-branca.png";
import Navbar from "../../components/navbar"
import AccessCodeInput from "../../components/code";

function randomPhoto(max) {
  return Math.floor(Math.random() * max);
}

const photos = [Casinhas, Auditorio, Frente, Letreiro, Pessoas, Refeitorio];
const numberRandom = randomPhoto(photos.length);
const photo = photos[numberRandom];

export default function HomeScreen() {
  const pathname = usePathname();
  const [code, setCode] = useState("");
  
  let [fontsLoaded] = useFonts({
    Manrope_700Bold,
  });

  const handleLogin = () => {
    if (code.toUpperCase() === "FER") {
      router.push("/(tabs)/onboarding");
    } else {
      Alert.alert("❌ Código incorreto", "Por favor, verifique o código de acesso.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={photo}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={1000}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.loginButton}>
          <Image
            source={Logo}
            style={styles.logo}
            contentFit="contain"
            transition={1000}
          />
          <AccessCodeInput value={code} onChangeText={setCode} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily : "Manrope_700Bold",
    color: "#fff" 
  }, 
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(39, 32, 54, 0.6)",
  },
  loginButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#272036dc",
    borderRadius: 35,
    padding: 20,
    width: "40%",
    height: "40%",
  },
  logo: {
    width: 120,
    height: 100,
    alignSelf: "center",
    bottom: 10,
  },
  button: {
    backgroundColor: "#8141C2",
    borderRadius: 20,
    width: "32%",
    height: "25%",
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Manrope_700Bold",
  },
});