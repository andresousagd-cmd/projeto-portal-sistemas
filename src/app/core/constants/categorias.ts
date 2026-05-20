export const CATEGORIAS_CAIXA = [
  'Atendimento',
  'Crédito',
  'Habitação',
  'Investimentos',
  'RH',
] as const;

export type CategoriaCaixa = (typeof CATEGORIAS_CAIXA)[number];
