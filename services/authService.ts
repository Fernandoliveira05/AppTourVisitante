import { apiClient } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * 
 * Este arquivo contém todos os métodos relacionados à autenticação.
 * Centraliza a lógica de login, logout, registro, etc.
 */

// Tipos/Interfaces para tipagem TypeScript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Classe de serviço de autenticação
 */
class AuthService {
  /**
   * Realiza login do usuário
   * 
   * @param credentials - Email e senha do usuário
   * @returns Dados do usuário e token de autenticação
   * 
   * Exemplo de uso:
   * ```typescript
   * try {
   *   const response = await authService.login({ 
   *     email: 'user@example.com', 
   *     password: '123456' 
   *   });
   *   console.log('Login realizado:', response);
   * } catch (error) {
   *   console.error('Erro no login:', error);
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.post<AuthResponse>(
    //   AUTH_ENDPOINTS.LOGIN,
    //   credentials
    // );
    // 
    // // Salva o token no AsyncStorage
    // await AsyncStorage.setItem('@auth_token', response.data.token);
    // 
    // // Se houver refresh token, salva também
    // if (response.data.refreshToken) {
    //   await AsyncStorage.setItem('@refresh_token', response.data.refreshToken);
    // }
    // 
    // return response.data;

    // Mock de resposta para desenvolvimento (REMOVA quando integrar com API real)
    console.log('🔐 Mock Login:', credentials);
    return {
      token: 'mock_token_123',
      user: {
        id: '1',
        name: 'Usuário Teste',
        email: credentials.email,
      },
    };
  }

  /**
   * Realiza logout do usuário
   * 
   * Exemplo de uso:
   * ```typescript
   * await authService.logout();
   * router.push('/login');
   * ```
   */
  async logout(): Promise<void> {
    // TODO: Descomente quando a API estiver pronta
    // try {
    //   await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    // } catch (error) {
    //   console.error('Erro ao fazer logout na API:', error);
    // }

    // Remove tokens do AsyncStorage
    await AsyncStorage.multiRemove(['@auth_token', '@refresh_token']);
    console.log('🔓 Logout realizado');
  }

  /**
   * Registra um novo usuário
   * 
   * @param data - Dados do novo usuário
   * @returns Dados do usuário registrado
   * 
   * Exemplo de uso:
   * ```typescript
   * const newUser = await authService.register({
   *   name: 'João Silva',
   *   email: 'joao@example.com',
   *   password: '123456',
   *   passwordConfirmation: '123456'
   * });
   * ```
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.post<AuthResponse>(
    //   AUTH_ENDPOINTS.REGISTER,
    //   data
    // );
    // 
    // // Salva o token automaticamente após o registro
    // await AsyncStorage.setItem('@auth_token', response.data.token);
    // 
    // return response.data;

    // Mock de resposta para desenvolvimento (REMOVA quando integrar com API real)
    console.log('📝 Mock Register:', data);
    return {
      token: 'mock_token_456',
      user: {
        id: '2',
        name: data.name,
        email: data.email,
      },
    };
  }

  /**
   * Recupera o token armazenado
   * 
   * @returns Token de autenticação ou null
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@auth_token');
  }

  /**
   * Verifica se o usuário está autenticado
   * 
   * @returns true se houver token válido
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  /**
   * Solicita recuperação de senha
   * 
   * @param email - Email do usuário
   * 
   * Exemplo de uso:
   * ```typescript
   * await authService.forgotPassword('user@example.com');
   * Alert.alert('Email enviado', 'Verifique sua caixa de entrada');
   * ```
   */
  async forgotPassword(email: string): Promise<void> {
    // TODO: Descomente quando a API estiver pronta
    // await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });

    console.log('📧 Mock Forgot Password:', email);
  }

  /**
   * Redefine a senha do usuário
   * 
   * @param token - Token recebido por email
   * @param newPassword - Nova senha
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Descomente quando a API estiver pronta
    // await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    //   token,
    //   password: newPassword,
    // });

    console.log('🔑 Mock Reset Password');
  }
}

// Exporta uma instância única do serviço (Singleton)
export const authService = new AuthService();

/**
 * COMO USAR NO COMPONENTE:
 * 
 * import { authService } from '@/services/authService';
 * 
 * // No seu componente de login:
 * const handleLogin = async () => {
 *   try {
 *     const response = await authService.login({
 *       email: email,
 *       password: password
 *     });
 *     // Redirecionar para home
 *   } catch (error) {
 *     Alert.alert('Erro', 'Credenciais inválidas');
 *   }
 * };
 */
