import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * INTERCEPTORS DO AXIOS
 * 
 * Os interceptors permitem interceptar requisições e respostas antes que sejam
 * processadas pelos handlers .then() ou .catch()
 * 
 * Casos de uso comuns:
 * - Adicionar token de autenticação em todas as requisições
 * - Tratar erros globalmente
 * - Adicionar logs de requisições
 * - Modificar headers dinamicamente
 */

/**
 * Interceptor de Requisição (Request)
 * Executado ANTES de cada requisição ser enviada
 */
const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  // TODO: Adicione o token de autenticação às requisições
  // Exemplo: recuperar token do AsyncStorage e adicionar ao header
  
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
  }

  // TODO: Adicione logs de desenvolvimento (remova em produção)
  if (__DEV__) {
    console.log('📤 REQUEST:', config.method?.toUpperCase(), config.url);
    console.log('   Headers:', config.headers);
    if (config.data) console.log('   Body:', config.data);
  }

  return config;
};

/**
 * Interceptor de Erro na Requisição
 * Executado quando há erro ao PREPARAR a requisição
 */
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  if (__DEV__) {
    console.error('❌ REQUEST ERROR:', error);
  }
  return Promise.reject(error);
};

/**
 * Interceptor de Resposta (Response)
 * Executado DEPOIS de receber a resposta com sucesso
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
  // TODO: Adicione logs de desenvolvimento (remova em produção)
  if (__DEV__) {
    console.log('📥 RESPONSE:', response.status, response.config.url);
    console.log('   Data:', response.data);
  }

  // TODO: Transforme os dados da resposta se necessário
  // Exemplo: extrair apenas o campo 'data' de uma resposta padrão
  // if (response.data && response.data.data) {
  //   response.data = response.data.data;
  // }

  return response;
};

/**
 * Interceptor de Erro na Resposta
 * Executado quando a requisição retorna com erro (status 4xx ou 5xx)
 */
const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  if (__DEV__) {
    console.error('❌ RESPONSE ERROR:', error.response?.status, error.config?.url);
    console.error('   Error data:', error.response?.data);
  }

  // TODO: Trate erros específicos globalmente
  
  // Exemplo 1: Token expirado (401) - redirecionar para login
  if (error.response?.status === 401) {
    // await AsyncStorage.removeItem('@auth_token');
    // NavigationService.navigate('Login'); // você precisará implementar NavigationService
    console.warn('⚠️ Token expirado ou inválido');
  }

  // Exemplo 2: Servidor indisponível (500+)
  if (error.response?.status && error.response.status >= 500) {
    console.error('🔥 Erro no servidor');
    // Mostrar mensagem amigável ao usuário
  }

  // Exemplo 3: Sem conexão com internet
  if (!error.response) {
    console.error('🌐 Sem conexão com a internet');
    // Mostrar mensagem de erro de rede
  }

  // TODO: Adicione lógica de retry automático para requisições falhadas
  // const config = error.config;
  // if (config && config.retry < 3) {
  //   config.retry = (config.retry || 0) + 1;
  //   return apiClient.request(config);
  // }

  return Promise.reject(error);
};

/**
 * Configura todos os interceptors na instância do Axios
 */
export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // Interceptors de requisição
  axiosInstance.interceptors.request.use(onRequest, onRequestError);

  // Interceptors de resposta
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
};

/**
 * COMO USAR:
 * 
 * Os interceptors são configurados automaticamente ao criar o apiClient.
 * Você não precisa chamar setupInterceptors manualmente.
 * 
 * Para personalizar:
 * 1. Modifique as funções onRequest, onResponse, etc.
 * 2. Adicione suas regras de negócio específicas
 * 3. Implemente tratamento de erros personalizado
 */
