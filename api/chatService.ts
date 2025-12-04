// api/chatService.ts
import { apiClient } from "@/api/client";

/**
 * Tipos das estruturas de Pergunta e Resposta
 * de acordo com o backend
 */

export type PerguntaEstado =
  | "queued"
  | "answerable"
  | "answered"
  | "discarded";

export interface Pergunta {
  id: number;
  tour_id: number;
  checkpoint_id: number;
  question_topic: string | null;
  texto: string;
  estado: PerguntaEstado;
  liberado_em: string | null;
  respondido_em: string | null;
  criado_em: string;
}

export interface Resposta {
  id: number;
  pergunta_id: number;
  respondido_por_tipo: string;
  respondido_por_usuario: string | null;
  texto: string;
  criado_em: string;
}

export interface CreatePerguntaRequest {
  tour_id: number;
  checkpoint_id: number;
  question_topic: string | null;
  texto: string;
  estado: PerguntaEstado;
}

/**
 * Cria uma nova pergunta
 * POST /v1/perguntas
 */
export async function createPergunta(
  data: CreatePerguntaRequest
): Promise<Pergunta> {
  const response = await apiClient.post("/v1/perguntas", data);

  // backend está no formato: { data: { ...pergunta }, message: "..." }
  return response.data.data as Pergunta;
}

/**
 * Busca a resposta de uma pergunta específica
 * GET /v1/respostas/{perguntaId}
 *
 * Se a pergunta ainda não tiver resposta, o backend devolve 404
 * -> nesse caso retornamos null
 */
export async function getRespostaByPerguntaId(
  perguntaId: number
): Promise<Resposta | null> {
  try {
    const response = await apiClient.get(`/v1/respostas/${perguntaId}`);
    return response.data.data as Resposta;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      // Ainda não respondida
      return null;
    }
    throw error;
  }
}

/**
 * Busca TODAS as perguntas
 * GET /v1/perguntas
 *
 * Response esperado:
 * { data: Pergunta[], message: "..." }
 */
export async function getHistoricoChat(): Promise<Pergunta[]> {
  const response = await apiClient.get("/v1/perguntas");
  return response.data.data as Pergunta[];
}
