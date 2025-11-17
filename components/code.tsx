import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 

export default function AccessCodeInput() {
  const [secureText, setSecureText] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value.toUpperCase() === "FER") {
      Alert.alert("✅ Código correto", "Bem-vindo, FER!", [
        { onPress: () => router.push("/(tabs)/onboarding") },
      ]);
      console.log("PASSOU!")
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Código de Acesso <Text style={{ color: "#ff4b8f" }}>*</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={secureText}
          value={value}
          onChangeText={setValue}
          autoCapitalize="characters"
          placeholder=""
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    alignSelf: "center",
    marginTop: 5,
    bottom: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
  },
});
