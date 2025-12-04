/**
 * SERVIÇO DE ALERTAS/EMERGÊNCIA
 * 
 * Este arquivo contém todos os métodos relacionados ao sistema de alertas.
 * Gerencia criação, atualização e consulta de alertas de emergência.
 */

import { apiClient } from '@/api/client';
import { ALERT_ENDPOINTS } from '@/api/endpoints';

// Tipos/Interfaces
export type AlertLevel = 'baixo' | 'medio' | 'alto';

export interface AlertDTO {
  id?: number;
  nivel: AlertLevel;
  mensagem: string | null;
  origem: string | null;
  resolvido_em: string | null;
  tour_id: number | null;
}

export interface CreateAlertRequest {
  nivel: AlertLevel;
  mensagem?: string | null;
  origem?: string | null;
  tour_id?: number | null;
}

export interface UpdateAlertRequest {
  nivel: AlertLevel;
  mensagem?: string | null;
  origem?: string | null;
  resolvido_em?: string | null;
  tour_id?: number | null;
}

interface AlertApiResponse<T> {
  data: T;
  message: string;
}

/**
 * Classe de serviço de Alertas
 */
class AlertService {
  /**
   * Cria um novo alerta de emergência
   * 
   * @param request - Dados do alerta
   * @returns Alerta criado
   * 
   * Exemplo de uso:
   * ```typescript
   * const alert = await alertService.createAlert({
   *   nivel: 'alto',
   *   mensagem: 'Emergência acionada pelo visitante',
   *   origem: 'app_visitante',
   *   tour_id: 123
   * });
   * ```
   */
  async createAlert(request: CreateAlertRequest): Promise<AlertDTO> {
    try {
      console.log('📡 Criando alerta:', request);
      
      const response = await apiClient.post<AlertApiResponse<AlertDTO>>(
        ALERT_ENDPOINTS.CREATE,
        request
      );

      console.log('✅ Alerta criado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao criar alerta:', error);
      throw error;
    }
  }

  /**
   * Busca todos os alertas
   * 
   * @returns Lista de alertas
   */
  async getAllAlerts(): Promise<AlertDTO[]> {
    try {
      console.log('📡 Buscando todos os alertas');
      
      const response = await apiClient.get<AlertApiResponse<AlertDTO[]>>(
        ALERT_ENDPOINTS.GET_ALL
      );

      console.log('✅ Alertas encontrados:', response.data.data.length);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar alertas:', error);
      throw error;
    }
  }

  /**
   * Busca um alerta específico por ID
   * 
   * @param id - ID do alerta
   * @returns Alerta encontrado
   */
  async getAlertById(id: number): Promise<AlertDTO> {
    try {
      console.log('📡 Buscando alerta:', id);
      
      const response = await apiClient.get<AlertApiResponse<AlertDTO>>(
        ALERT_ENDPOINTS.GET_BY_ID(id)
      );

      console.log('✅ Alerta encontrado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar alerta:', error);
      throw error;
    }
  }

  /**
   * Atualiza um alerta existente
   * 
   * @param id - ID do alerta
   * @param request - Dados atualizados
   * @returns Alerta atualizado
   * 
   * Exemplo de uso:
   * ```typescript
   * const updated = await alertService.updateAlert(123, {
   *   nivel: 'baixo',
   *   resolvido_em: new Date().toISOString()
   * });
   * ```
   */
  async updateAlert(id: number, request: UpdateAlertRequest): Promise<AlertDTO> {
    try {
      console.log('📡 Atualizando alerta:', id, request);
      
      const response = await apiClient.put<AlertApiResponse<AlertDTO>>(
        ALERT_ENDPOINTS.UPDATE(id),
        request
      );

      console.log('✅ Alerta atualizado:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar alerta:', error);
      throw error;
    }
  }

  /**
   * Deleta um alerta
   * 
   * @param id - ID do alerta
   */
  async deleteAlert(id: number): Promise<void> {
    try {
      console.log('📡 Deletando alerta:', id);
      
      await apiClient.delete(ALERT_ENDPOINTS.DELETE(id));

      console.log('✅ Alerta deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar alerta:', error);
      throw error;
    }
  }

  /**
   * Resolve um alerta (marca como resolvido)
   * 
   * @param id - ID do alerta
   * @param nivel - Novo nível do alerta
   * @returns Alerta resolvido
   */
  async resolveAlert(id: number, nivel: AlertLevel = 'baixo'): Promise<AlertDTO> {
    return this.updateAlert(id, {
      nivel,
      resolvido_em: new Date().toISOString()
    });
  }

  /**
   * Cria um alerta de emergência com nível alto
   * Método de conveniência para situações de emergência
   * 
   * @param tourId - ID do tour
   * @param mensagem - Mensagem adicional
   * @returns Alerta de emergência criado
   */
  async triggerEmergency(tourId: number | null, mensagem?: string): Promise<AlertDTO> {
    return this.createAlert({
      nivel: 'alto',
      mensagem: mensagem || 'Emergência acionada pelo visitante',
      origem: 'app_visitante',
      tour_id: tourId
    });
  }
}

// Exporta uma instância única do serviço (Singleton)
export const alertService = new AlertService();

/**
 * COMO USAR NO COMPONENTE:
 * 
 * import { alertService } from '@/services/alertService';
 * import { useTour } from '@/context/TourContext';
 * 
 * // No componente de emergência:
 * const { tour } = useTour();
 * 
 * const handleEmergencyPress = async () => {
 *   try {
 *     const alert = await alertService.triggerEmergency(
 *       tour?.tourId ?? null,
 *       'Emergência acionada'
 *     );
 *     
 *     Alert.alert(
 *       '🚨 Emergência Acionada',
 *       'A equipe Inteli foi notificada e prestará auxílio em breve.',
 *       [{ text: 'OK' }]
 *     );
 *   } catch (error) {
 *     Alert.alert('Erro', 'Não foi possível acionar a emergência');
 *   }
 * };
 */
