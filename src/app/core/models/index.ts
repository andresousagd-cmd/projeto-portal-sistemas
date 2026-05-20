export interface Usuario {
  id: number;
  matricula: string;
  nome: string;
  area: string;
  cargo?: string;
}

export interface Sistema {
  id: number;
  nome: string;
  sigla: string;
  descricao: string;
  categoria: string;
  areaResponsavel: string;
  urlAcesso: string;
  corIcone: string;
  icone?: string;
  lancamento: boolean;
  restrito: boolean;
  liberado: boolean;
  ultimoAcesso?: string;
  favorito?: boolean;
  totalAcessos?: number;
}

export interface LoginRequest {
  matricula: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface HomeData {
  favoritos: Sistema[];
  lancamentos: Sistema[];
  ultimosAcessados: Sistema[];
  maisAcessados: Sistema[];
}

export interface SolicitacaoAcessoRequest {
  sistemaId: number;
  justificativa: string;
  observacoes?: string;
}

export interface SearchResult {
  items: Sistema[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PortalExterno {
  id: string;
  nome: string;
  url: string;
  descricao?: string;
  criadoEm: string;
}

export interface PortalExternoInput {
  nome: string;
  url: string;
  descricao?: string;
}

export type StatusOperacionalSistema = 'disponivel' | 'lentidao' | 'indisponivel';

export interface SistemaStatusConsulta {
  sistema: Sistema;
  status: StatusOperacionalSistema;
  mensagem: string;
  atualizadoEm: string;
}
