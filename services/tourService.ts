import { apiClient } from '@/api/client';
import { TOUR_ENDPOINTS } from '@/api/endpoints';

/**
 * SERVIÇO DE TOUR
 * 
 * Este arquivo contém todos os métodos relacionados ao tour guiado.
 * Gerencia checkpoints, progresso do tour, etc.
 */

// Tipos/Interfaces
export interface Checkpoint {
  id: number;
  name: string;
  description: string;
  x: number; // Coordenada X no mapa (%)
  y: number; // Coordenada Y no mapa (%)
  state: 'unvisited' | 'visited' | 'visiting';
  order: number;
  locationId: string;
}

export interface Tour {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  currentCheckpointId?: number;
  checkpoints: Checkpoint[];
}

export interface StartTourResponse {
  tour: Tour;
  message: string;
}

export interface CompleteCheckpointData {
  completedAt: string;
  notes?: string;
}

/**
 * Classe de serviço de Tour
 */
class TourService {
  /**
   * Inicia um novo tour
   * 
   * @returns Dados do tour iniciado
   * 
   * Exemplo de uso:
   * ```typescript
   * const tour = await tourService.startTour();
   * console.log('Tour iniciado:', tour);
   * ```
   */
  async startTour(): Promise<StartTourResponse> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.post<StartTourResponse>(
    //   TOUR_ENDPOINTS.START
    // );
    // return response.data;

    // Mock de resposta para desenvolvimento
    console.log('🚀 Mock Start Tour');
    return {
      tour: {
        id: 'tour_123',
        userId: 'user_1',
        startTime: new Date().toISOString(),
        status: 'in_progress',
        currentCheckpointId: 1,
        checkpoints: [],
      },
      message: 'Tour iniciado com sucesso',
    };
  }

  /**
   * Busca todos os checkpoints do tour
   * 
   * @returns Lista de checkpoints
   * 
   * Exemplo de uso:
   * ```typescript
   * const checkpoints = await tourService.getCheckpoints();
   * setCheckpoints(checkpoints);
   * ```
   */
  async getCheckpoints(): Promise<Checkpoint[]> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.get<Checkpoint[]>(
    //   TOUR_ENDPOINTS.CHECKPOINTS
    // );
    // return response.data;

    // Mock de resposta para desenvolvimento
    console.log('📍 Mock Get Checkpoints');
    return [
      { id: 1, name: 'Recepção', description: 'Entrada principal', x: 77, y: 50, state: 'visited', order: 1, locationId: 'loc_1' },
      { id: 2, name: 'Auditório', description: 'Sala de eventos', x: 50, y: 47, state: 'visited', order: 2, locationId: 'loc_2' },
      { id: 3, name: 'Labs', description: 'Laboratórios', x: 40, y: 38, state: 'visiting', order: 3, locationId: 'loc_3' },
      { id: 4, name: 'Refeitório', description: 'Área de alimentação', x: 14.5, y: 58, state: 'unvisited', order: 4, locationId: 'loc_4' },
      { id: 5, name: 'Biblioteca', description: 'Espaço de estudos', x: 5, y: 28, state: 'unvisited', order: 5, locationId: 'loc_5' },
    ];
  }

  /**
   * Busca um checkpoint específico por ID
   * 
   * @param id - ID do checkpoint
   * @returns Dados do checkpoint
   * 
   * Exemplo de uso:
   * ```typescript
   * const checkpoint = await tourService.getCheckpointById(1);
   * console.log('Checkpoint:', checkpoint);
   * ```
   */
  async getCheckpointById(id: number): Promise<Checkpoint> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.get<Checkpoint>(
    //   TOUR_ENDPOINTS.CHECKPOINT_BY_ID(id)
    // );
    // return response.data;

    // Mock de resposta para desenvolvimento
    console.log('📍 Mock Get Checkpoint By ID:', id);
    return {
      id,
      name: `Checkpoint ${id}`,
      description: 'Descrição do checkpoint',
      x: 50,
      y: 50,
      state: 'visiting',
      order: id,
      locationId: `loc_${id}`,
    };
  }

  /**
   * Marca um checkpoint como completo
   * 
   * @param checkpointId - ID do checkpoint
   * @param data - Dados de conclusão (opcional)
   * @returns Checkpoint atualizado
   * 
   * Exemplo de uso:
   * ```typescript
   * await tourService.completeCheckpoint(3, {
   *   completedAt: new Date().toISOString(),
   *   notes: 'Tour concluído sem problemas'
   * });
   * ```
   */
  async completeCheckpoint(
    checkpointId: number,
    data?: CompleteCheckpointData
  ): Promise<Checkpoint> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.post<Checkpoint>(
    //   TOUR_ENDPOINTS.COMPLETE_CHECKPOINT(checkpointId),
    //   data || { completedAt: new Date().toISOString() }
    // );
    // return response.data;

    // Mock de resposta para desenvolvimento
    console.log('✅ Mock Complete Checkpoint:', checkpointId, data);
    return {
      id: checkpointId,
      name: `Checkpoint ${checkpointId}`,
      description: 'Checkpoint concluído',
      x: 50,
      y: 50,
      state: 'visited',
      order: checkpointId,
      locationId: `loc_${checkpointId}`,
    };
  }

  /**
   * Busca o tour atual em andamento
   * 
   * @returns Tour em andamento ou null
   * 
   * Exemplo de uso:
   * ```typescript
   * const currentTour = await tourService.getCurrentTour();
   * if (currentTour) {
   *   console.log('Tour em andamento:', currentTour);
   * }
   * ```
   */
  async getCurrentTour(): Promise<Tour | null> {
    // TODO: Descomente quando a API estiver pronta
    // try {
    //   const response = await apiClient.get<Tour>(
    //     TOUR_ENDPOINTS.CURRENT_TOUR
    //   );
    //   return response.data;
    // } catch (error) {
    //   // Se não houver tour em andamento, retorna null
    //   return null;
    // }

    // Mock de resposta para desenvolvimento
    console.log('🔍 Mock Get Current Tour');
    return null; // Simula que não há tour em andamento
  }

  /**
   * Busca o histórico de tours do usuário
   * 
   * @returns Lista de tours realizados
   * 
   * Exemplo de uso:
   * ```typescript
   * const history = await tourService.getTourHistory();
   * console.log('Tours realizados:', history.length);
   * ```
   */
  async getTourHistory(): Promise<Tour[]> {
    // TODO: Descomente quando a API estiver pronta
    // const response = await apiClient.get<Tour[]>(
    //   TOUR_ENDPOINTS.HISTORY
    // );
    // return response.data;

    // Mock de resposta para desenvolvimento
    console.log('📜 Mock Get Tour History');
    return [];
  }

  /**
   * Cancela o tour atual
   * 
   * @param tourId - ID do tour a ser cancelado
   * 
   * Exemplo de uso:
   * ```typescript
   * await tourService.cancelTour('tour_123');
   * ```
   */
  async cancelTour(tourId: string): Promise<void> {
    // TODO: Descomente quando a API estiver pronta
    // await apiClient.delete(`/tour/${tourId}`);

    console.log('❌ Mock Cancel Tour:', tourId);
  }
}

// Exporta uma instância única do serviço (Singleton)
export const tourService = new TourService();

/**
 * COMO USAR NO COMPONENTE:
 * 
 * import { tourService } from '@/services/tourService';
 * 
 * // No componente de mapa:
 * useEffect(() => {
 *   const loadCheckpoints = async () => {
 *     const data = await tourService.getCheckpoints();
 *     setCheckpoints(data);
 *   };
 *   loadCheckpoints();
 * }, []);
 * 
 * // Ao completar um checkpoint:
 * const handleCompleteCheckpoint = async (id: number) => {
 *   await tourService.completeCheckpoint(id);
 *   // Atualizar estado local
 * };
 */
