import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { useFonts } from "@expo-google-fonts/manrope/useFonts";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router"; // <--- Importe useFocusEffect
import { useState, useCallback } from "react"; // <--- Importe useCallback
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard, 
} from "react-native";

// Imagens
import Auditorio from "../../assets/images/Login/Auditório.jpg";
import Casinhas from "../../assets/images/Login/Casinhas.jpg";
import Frente from "../../assets/images/Login/Frente.jpg";
import Refeitorio from "../../assets/images/Login/Refeitorio.jpg";
import Logo from "../../assets/images/logo-branca.png";
import Tour from "../../assets/images/AppTour.jpg";
import Tour2 from "../../assets/images/AppTour2.jpg";
import Tour3 from "../../assets/images/AppTour3.jpg";
import Tour4 from "../../assets/images/AppTour4.jpg";
import Tour5 from "../../assets/images/AppTour5.jpg";
import Tour6 from "../../assets/images/AppTour6.jpg";
import Tour7 from "../../assets/images/AppTour7.jpg";

import { useTour } from "@/context/TourContext";

// Componentes e serviços
import AccessCodeInput from "../../components/code";
import Loading from "../../components/loading";
import { tourService } from "../../services/tourService";
import { checkpointService } from "../../services/checkpointService";
import {
  getTourVisitanteByTourId,
  getVisitanteById,
} from "../../services/visitanteService";

function randomPhoto(max: number) {
  return Math.floor(Math.random() * max);
}

const photos = [Casinhas, Auditorio, Tour, Tour2, Tour3, Tour4, Tour5, Tour6, Tour7, Refeitorio];
const numberRandom = randomPhoto(photos.length);
const photo = photos[numberRandom];

export default function HomeScreen() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setTour } = useTour();

  const [fontsLoaded] = useFonts({
    Manrope_700Bold,
  });

  // 🔥 CORREÇÃO: Reseta o estado toda vez que a tela de login aparece
  useFocusEffect(
    useCallback(() => {
      // 1. Limpa o loading para evitar travamentos visuais
      setIsLoading(false);
      // 2. Limpa o código para o usuário digitar um novo
      setCode("");
      // 3. Garante que o contexto esteja limpo antes de começar um novo tour
      setTour(null);
    }, [])
  );

  const handleLogin = async () => {
    Keyboard.dismiss(); 

    if (!code || code.trim().length === 0) {
      Alert.alert("Código incorreto", "Por favor, digite o código de acesso.");
      return;
    }

    setIsLoading(true);

    // ============================================================
    // LOGIN DE DESENVOLVEDOR (MOCK)
    // ============================================================
    if (code.toUpperCase() === "FER") {
      console.log("🦄 Login de DEV detectado");
      
      setTimeout(() => {
        const mockTour = {
          id: 9999, 
          codigo: "FER",
          titulo: "Tour DEV! Apenas para testes",
        };
        const mockVisitorName = "Fernando Oliveira";
        const mockCheckpointId = 4;

        setTour({
          tourId: mockTour.id,
          checkpointId: mockCheckpointId,
          visitorName: mockVisitorName,
        });

        setIsLoading(false);

        // Use REPLACE para não empilhar telas
        router.replace({
          pathname: "/(tabs)/onboarding",
          params: {
            tourId: mockTour.id.toString(),
            tourCode: mockTour.codigo,
            tourTitle: mockTour.titulo,
            visitorName: mockVisitorName,
            visitorCount: "1",
          },
        });
      }, 1500);

      return; 
    }

    // ============================================================
    // LOGIN REAL
    // ============================================================
    try {
      console.log("Tentando login com código:", code);

      const data = await tourService.loginByCode(code);
      const tour = data.tour;

      console.log("Login bem-sucedido! ID:", tour.id, "Status:", tour.status);
      
      // ATUALIZAÇÃO DE STATUS (SCHEDULED -> INPROGRESS)
      if (tour.id && tour.status === 'scheduled') {
        try {
          console.log("🔄 Atualizando status do tour para inprogress...");
          const { id, ...tourDataWithoutId } = tour;

          await tourService.updateTour(tour.id, {
            ...tourDataWithoutId, 
            status: 'inprogress', 
            inicio_real: new Date().toISOString()
          });
          
          tour.status = 'inprogress';
          console.log("✅ Status atualizado com sucesso!");
        } catch (updateError) {
          console.error("⚠️ Erro ao atualizar status (prosseguindo login):", updateError);
        }
      }

      // BUSCA DE CHECKPOINTS
      let checkpointId: number | null = null;
      try {
        const checkpoints = await checkpointService.getByTourId(tour.id!);
        const currentCheckpoint = checkpointService.getCurrent(checkpoints);
        checkpointId = currentCheckpoint?.id ?? null;
      } catch (err: any) {
        console.log("Erro ao buscar checkpoints:", err?.message);
        checkpointId = null;
      }

      // BUSCA DO NOME DO VISITANTE
      let visitorName = "Visitante";
      try {
        const rel = await getTourVisitanteByTourId(tour.id!);
        if (rel?.visitante_id) {
          const visitante = await getVisitanteById(rel.visitante_id);
          if (visitante?.nome) visitorName = visitante.nome;
        }
      } catch (err) {
        console.log("[login] Erro ao buscar visitante:", err);
      }

      if (visitorName === "Visitante" && Array.isArray(data.visitantes) && data.visitantes.length > 0) {
        visitorName = data.visitantes[0].nome || "Visitante";
      }

      // SALVAR NO CONTEXTO
      setTour({
        tourId: tour.id ?? null,
        checkpointId,
        visitorName,
      });

      // 🔥 USE REPLACE AQUI TAMBÉM
      // Isso impede que o Login fique "por baixo" do app, economizando memória e evitando bugs de voltar
      router.replace({
        pathname: "/(tabs)/onboarding",
        params: {
          tourId: tour.id?.toString() || "",
          tourCode: tour.codigo,
          tourTitle: tour.titulo || "Tour",
          visitorName: visitorName,
          visitorCount: data.visitantes?.length?.toString() ?? "1",
        },
      });

    } catch (error: any) {
      console.error("Erro no login:", error);
      setIsLoading(false); // Garante que o loading pare em caso de erro

      let errorMessage = "Por favor, verifique o código de acesso.";

      if (error?.message === "Tour não encontrado com o código fornecido") {
        errorMessage = "Não encontramos um tour com este código.";
      } else if (error?.message?.includes("Erro de conexão")) {
        errorMessage = "Verifique sua conexão com a internet.";
      }

      Alert.alert("Código incorreto", errorMessage);
    } 
    // Removemos o 'finally' genérico porque controlamos o setIsLoading dentro dos blocos
    // para evitar setar state em componente desmontado após o router.replace
  };

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
      
      <Image
        source={photo}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={1000}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.loginButton} 
            activeOpacity={1} 
            onPress={Keyboard.dismiss}
          >
            <Image
              source={Logo}
              style={styles.logo}
              contentFit="contain"
              transition={1000}
            />

            <AccessCodeInput value={code} onChangeText={setCode} />

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    fontFamily: "Manrope_700Bold",
    color: "#fff",
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
    minHeight: 250, 
    justifyContent: 'space-between'
  },
  logo: {
    width: 120,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#8141C2",
    borderRadius: 20,
    width: "80%",
    height: 50,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
  },
});