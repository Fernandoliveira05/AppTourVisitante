/**
 * CENTRALIZAÇÃO DE ENDPOINTS DA API
 * 
 * Este arquivo centraliza todos os endpoints da API em um único lugar.
 * Facilita a manutenção e evita erros de digitação.
 * 
 * Organize os endpoints por módulo/recurso.
 */

/**
 * Endpoints de Autenticação
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
};

/**
 * Endpoints de Tour
 * TODO: Ajuste os endpoints conforme sua API real
 */
export const TOUR_ENDPOINTS = {
  START: '/tour/start',
  CHECKPOINTS: '/tour/checkpoints',
  CHECKPOINT_BY_ID: (id: number) => `/tour/checkpoints/${id}`,
  COMPLETE_CHECKPOINT: (id: number) => `/tour/checkpoints/${id}/complete`,
  CURRENT_TOUR: '/tour/current',
  HISTORY: '/tour/history',
};

/**
 * Endpoints de Chat/Assistente
 * TODO: Ajuste os endpoints conforme sua API real
 */
export const CHAT_ENDPOINTS = {
  SEND_MESSAGE: '/chat/message',
  CONVERSATION: '/chat/conversation',
  CONVERSATION_BY_ID: (id: string) => `/chat/conversation/${id}`,
  VOICE_TO_TEXT: '/chat/voice-to-text',
  TEXT_TO_VOICE: '/chat/text-to-voice',
};

/**
 * Endpoints de Emergência
 * TODO: Ajuste os endpoints conforme sua API real
 */
export const EMERGENCY_ENDPOINTS = {
  TRIGGER: '/emergency/trigger',
  STATUS: '/emergency/status',
  CANCEL: '/emergency/cancel',
  HISTORY: '/emergency/history',
};

/**
 * Endpoints de Mapa
 * TODO: Ajuste os endpoints conforme sua API real
 */
export const MAP_ENDPOINTS = {
  GET_MAP: '/map',
  GET_LOCATIONS: '/map/locations',
  GET_LOCATION_BY_ID: (id: number) => `/map/locations/${id}`,
  UPDATE_LOCATION: (id: number) => `/map/locations/${id}`,
};

/**
 * Endpoints de Usuário
 * TODO: Ajuste os endpoints conforme sua API real
 */
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  PREFERENCES: '/user/preferences',
  UPDATE_PREFERENCES: '/user/preferences',
};

/**
 * COMO USAR:
 * 
 * Importe os endpoints nos seus services:
 * 
 * import { TOUR_ENDPOINTS } from '@/api/endpoints';
 * 
 * const response = await apiClient.get(TOUR_ENDPOINTS.CHECKPOINTS);
 * const checkpoint = await apiClient.get(TOUR_ENDPOINTS.CHECKPOINT_BY_ID(1));
 */
