import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { useFonts } from "@expo-google-fonts/manrope/useFonts";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import { 
  Alert, 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";

// Importar imagens
import Auditorio from "../../assets/images/Login/Auditório.jpg";
import Casinhas from "../../assets/images/Login/Casinhas.jpg";
import Frente from "../../assets/images/Login/Frente.jpg";
import Letreiro from "../../assets/images/Login/Letreiro.jpeg";
import Pessoas from "../../assets/images/Login/Pessoas.jpeg";
import Refeitorio from "../../assets/images/Login/Refeitorio.jpg";
import Logo from "../../assets/images/logo-branca.png";

// Importar componentes e serviços
import AccessCodeInput from "../../components/code";
import { tourService } from "../../services/tourService";

/**
 * Função para selecionar uma foto aleatória
 */
function randomPhoto(max) {
  return Math.floor(Math.random() * max);
}

// Array de fotos disponíveis
const photos = [Casinhas, Auditorio, Frente, Letreiro, Pessoas, Refeitorio];
const numberRandom = randomPhoto(photos.length);
const photo = photos[numberRandom];

/**
 * Tela inicial de login com código de acesso
 */
export default function HomeScreen() {
  const pathname = usePathname();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar fontes
  let [fontsLoaded] = useFonts({
    Manrope_700Bold,
  });

  /**
   * Função para lidar com o login
   * Valida o código e busca os dados do tour na API
   */
  const handleLogin = async () => {
    // Validação básica
    if (!code || code.trim().length === 0) {
      Alert.alert("❌ Código incorreto", "Por favor, digite o código de acesso.");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Tentando login com código:', code);
      
      // Chamar o serviço para validar o código e buscar dados
      const data = await tourService.loginByCode(code);

      console.log('✅ Login bem-sucedido!');
      console.log('📋 Tour:', data.tour);
      console.log('👥 Visitantes:', data.visitantes);

      // Preparar nome do visitante para exibição
      const visitorName = data.visitantes.length > 0 
        ? data.visitantes[0].nome || "Visitante"
        : "Visitante";

      // Navegar para a próxima tela passando os dados
      router.push({
        pathname: "/(tabs)/onboarding",
        params: { 
          tourId: data.tour.id?.toString() || '',
          tourCode: data.tour.codigo,
          tourTitle: data.tour.titulo || 'Tour',
          visitorName: visitorName,
          visitorCount: data.visitantes.length.toString(),
        }
      });

    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Tratamento de erros específicos
      let errorMessage = "Por favor, verifique o código de acesso.";

      if (error.message && error.message.includes('Tour não encontrado')) {
        errorMessage = "Não encontramos um tour com este código.";
      } else if (error.message && error.message.includes('Erro de conexão')) {
        errorMessage = "Verifique sua conexão com a internet.";
      }

      Alert.alert("❌ Código incorreto", errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem de fundo aleatória */}
      <Image
        source={photo}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={1000}
      />

      {/* Overlay escuro */}
      <View style={styles.overlay}>
        {/* Card de login */}
        <TouchableOpacity style={styles.loginButton}>
          {/* Logo */}
          <Image
            source={Logo}
            style={styles.logo}
            contentFit="contain"
            transition={1000}
          />
          
          {/* Input de código */}
          <AccessCodeInput 
            value={code} 
            onChangeText={setCode}
          />
          
          {/* Botão de entrar */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
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