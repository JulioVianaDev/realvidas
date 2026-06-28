import type { BackendAuthLocale } from './auth.backend-translations';

export type PipelineBackendMessageKey =
  | 'PIPELINE_COLUMN_START_TITLE'
  | 'PIPELINE_COLUMN_START_DESCRIPTION'
  | 'PIPELINE_COLUMN_NEGOTIATING_TITLE'
  | 'PIPELINE_COLUMN_NEGOTIATING_DESCRIPTION'
  | 'PIPELINE_COLUMN_SELLS_TITLE'
  | 'PIPELINE_COLUMN_SELLS_DESCRIPTION'
  | 'PIPELINE_COLUMN_START_DELETE_FORBIDDEN'
  | 'PIPELINE_COLUMN_FINISH_DELETE_FORBIDDEN'
  | 'PIPELINE_COLUMN_START_MOVE_FORBIDDEN'
  | 'PIPELINE_COLUMN_FINISH_MOVE_FORBIDDEN'
  | 'PIPELINE_COLUMN_INVALID_POSITION'
  | 'PIPELINE_COLUMN_DESCRIPTION_REQUIRED';

export const PIPELINE_BACKEND_MESSAGES: Record<
  PipelineBackendMessageKey,
  Record<BackendAuthLocale, string>
> = {
  PIPELINE_COLUMN_START_TITLE: {
    'en-US': 'Start conversation',
    'pt-BR': 'Iniciar conversa',
  },
  PIPELINE_COLUMN_START_DESCRIPTION: {
    'en-US':
      'Keep the card here when the customer just started a conversation: welcome, greeting, and needs discovery. Move the card away only when the customer is ready to negotiate.',
    'pt-BR':
      'Mantenha o cartão aqui quando o cliente acabou de iniciar a conversa: boas-vindas, saudação e identificação da necessidade. Só mova o cartão quando o cliente estiver pronto para negociar.',
  },
  PIPELINE_COLUMN_NEGOTIATING_TITLE: {
    'en-US': 'Negotiating with client',
    'pt-BR': 'Negociando com o cliente',
  },
  PIPELINE_COLUMN_NEGOTIATING_DESCRIPTION: {
    'en-US':
      'Move the card here when the customer is actively negotiating: discussing prices, proposals, discounts, or purchase conditions. Keep the card here while negotiation is ongoing.',
    'pt-BR':
      'Mova o cartão para cá quando o cliente estiver em negociação ativa: discutindo preços, propostas, descontos ou condições de compra. Mantenha o cartão aqui enquanto a negociação continuar.',
  },
  PIPELINE_COLUMN_SELLS_TITLE: {
    'en-US': 'Sales',
    'pt-BR': 'Vendas',
  },
  PIPELINE_COLUMN_SELLS_DESCRIPTION: {
    'en-US':
      'Move the card here only when the customer completed a sale with AI. Do not move cards here before the deal is closed.',
    'pt-BR':
      'Mova o cartão para cá somente quando o cliente concluir uma venda com IA. Não mova cartões para cá antes do negócio ser fechado.',
  },
  PIPELINE_COLUMN_START_DELETE_FORBIDDEN: {
    'en-US': 'The start column cannot be deleted.',
    'pt-BR': 'A coluna de início não pode ser excluída.',
  },
  PIPELINE_COLUMN_FINISH_DELETE_FORBIDDEN: {
    'en-US': 'The finish column cannot be deleted.',
    'pt-BR': 'A coluna de finalização não pode ser excluída.',
  },
  PIPELINE_COLUMN_START_MOVE_FORBIDDEN: {
    'en-US': 'The start column position is fixed and cannot be moved.',
    'pt-BR': 'A posição da coluna de início é fixa e não pode ser alterada.',
  },
  PIPELINE_COLUMN_FINISH_MOVE_FORBIDDEN: {
    'en-US': 'The finish column position is fixed and cannot be moved.',
    'pt-BR': 'A posição da coluna de finalização é fixa e não pode ser alterada.',
  },
  PIPELINE_COLUMN_INVALID_POSITION: {
    'en-US':
      'Columns must stay between the start and finish columns.',
    'pt-BR':
      'As colunas devem permanecer entre a coluna de início e a de finalização.',
  },
  PIPELINE_COLUMN_DESCRIPTION_REQUIRED: {
    'en-US':
      'Column description is required so the AI knows when to move cards to this column.',
    'pt-BR':
      'A descrição da coluna é obrigatória para a IA saber quando mover cartões para esta coluna.',
  },
};

export function getPipelineBackendMessage(
  key: PipelineBackendMessageKey,
  locale: BackendAuthLocale,
  params?: Record<string, string>,
): string {
  let message = PIPELINE_BACKEND_MESSAGES[key][locale];
  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      message = message.split(`{${paramKey}}`).join(value);
    }
  }
  return message;
}
