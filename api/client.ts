import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * CONFIGURAÇÃO DO CLIENTE AXIOS
 * 
 * Este arquivo centraliza a configuração do cliente HTTP usando Axios.
 * Aqui você define a URL base da API e configurações globais.
 */

// URL base da API conforme documentação
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.140.0.11:8080';

// Timeout padrão para requisições (em milissegundos)
const DEFAULT_TIMEOUT = 30000; // 30 segundos

/**
 * Cria e configura a instância do Axios
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Configura os interceptors (request/response)
  setupInterceptors(client);

  return client;
};

// Exporta a instância configurada do Axios
export const apiClient = createApiClient();

/**
 * COMO USAR:
 * 
 * 1. Configure a variável de ambiente EXPO_PUBLIC_API_URL no arquivo .env:
 *    EXPO_PUBLIC_API_URL=http://10.140.0.11:8080
 * 
 * 2. Importe o apiClient nos seus services:
 *    import { apiClient } from '@/api/client';
 * 
 * 3. Use os métodos do Axios:
 *    const response = await apiClient.get('/endpoint');
 *    const response = await apiClient.post('/endpoint', data);
 *    const response = await apiClient.put('/endpoint', data);
 *    const response = await apiClient.delete('/endpoint');
 */