import { HomeData, Sistema, SistemaStatusConsulta, StatusOperacionalSistema, Usuario } from '../models';

export const MOCK_STATUS_SISTEMAS: Record<
  number,
  { status: StatusOperacionalSistema; mensagem: string; atualizadoEm: string }
> = {
  1: { status: 'disponivel', mensagem: 'Operação normal', atualizadoEm: '2026-05-19T14:30:00' },
  2: { status: 'disponivel', mensagem: 'Operação normal', atualizadoEm: '2026-05-19T14:28:00' },
  3: { status: 'lentidao', mensagem: 'Resposta acima do tempo esperado', atualizadoEm: '2026-05-19T14:25:00' },
  4: { status: 'lentidao', mensagem: 'Alta demanda no atendimento', atualizadoEm: '2026-05-19T14:22:00' },
  5: { status: 'disponivel', mensagem: 'Operação normal', atualizadoEm: '2026-05-19T14:31:00' },
  6: { status: 'indisponivel', mensagem: 'Manutenção programada', atualizadoEm: '2026-05-19T13:00:00' },
  7: { status: 'indisponivel', mensagem: 'Falha na autenticação corporativa', atualizadoEm: '2026-05-19T12:45:00' },
  8: { status: 'disponivel', mensagem: 'Operação normal', atualizadoEm: '2026-05-19T14:29:00' },
  9: { status: 'lentidao', mensagem: 'Processamento de filas elevado', atualizadoEm: '2026-05-19T14:18:00' },
};

export const MOCK_USUARIOS: Record<string, Usuario> = {
  C000001: { id: 1, matricula: 'C000001', nome: 'Maria Silva', area: 'Atendimento - Agência Centro' },
  C000002: { id: 2, matricula: 'C000002', nome: 'João Santos', area: 'Habitação - Regional SP' },
  C000003: { id: 3, matricula: 'C000003', nome: 'Ana Oliveira', area: 'Crédito - Matriz' },
};

export const MOCK_SISTEMAS: Sistema[] = [
  {
    id: 1, nome: 'SISAG', sigla: 'SISAG', descricao: 'Sistema de Automação de Agências',
    categoria: 'Atendimento', areaResponsavel: 'Rede de Agências', urlAcesso: 'https://sisag.caixa.gov.br',
    corIcone: '#003B7E', lancamento: false, restrito: false, liberado: true, totalAcessos: 2180,
  },
  {
    id: 2, nome: 'SIATR', sigla: 'SIATR', descricao: 'Sistema de Atendimento de Transações e Registros',
    categoria: 'Atendimento', areaResponsavel: 'Diretoria de Negócios', urlAcesso: 'https://siatr.caixa.gov.br',
    corIcone: '#005EB8', lancamento: false, restrito: false, liberado: true, totalAcessos: 1950,
  },
  {
    id: 3, nome: 'SIPNL', sigla: 'SIPNL', descricao: 'Sistema de configuração dos ambientes de atendimento',
    categoria: 'Atendimento', areaResponsavel: 'TI Corporativa', urlAcesso: 'https://sipnl.caixa.gov.br',
    corIcone: '#64748B', lancamento: false, restrito: false, liberado: true, totalAcessos: 1420,
  },
  {
    id: 4, nome: 'Plataforma CAIXA', sigla: 'PLTC', descricao: 'Gerenciamento do atendimento',
    categoria: 'Atendimento', areaResponsavel: 'Rede de Agências', urlAcesso: 'https://plataforma.caixa.gov.br',
    corIcone: '#FFB81C', lancamento: true, restrito: false, liberado: true, totalAcessos: 2340,
  },
  {
    id: 5, nome: 'SIAVL', sigla: 'SIAVL', descricao: 'Atendimento Virtual',
    categoria: 'Atendimento', areaResponsavel: 'Canais Digitais', urlAcesso: 'https://siavl.caixa.gov.br',
    corIcone: '#22C55E', lancamento: true, restrito: false, liberado: true, totalAcessos: 1680,
  },
  {
    id: 6, nome: 'SIPLD', sigla: 'SIPLD', descricao: 'Prevenção à lavagem de dinheiro e gestão de riscos',
    categoria: 'Crédito', areaResponsavel: 'Compliance e Riscos', urlAcesso: 'https://sipld.caixa.gov.br',
    corIcone: '#003B7E', lancamento: false, restrito: true, liberado: false, totalAcessos: 890,
  },
  {
    id: 7, nome: 'SISGR', sigla: 'SISGR', descricao: 'Sistema integrado de segurança',
    categoria: 'Atendimento', areaResponsavel: 'Segurança Corporativa', urlAcesso: 'https://sisgr.caixa.gov.br',
    corIcone: '#005EB8', lancamento: false, restrito: true, liberado: false, totalAcessos: 720,
  },
  {
    id: 8, nome: 'SICOD', sigla: 'SICOD', descricao: 'Controle e gestão documental e de processos',
    categoria: 'RH', areaResponsavel: 'Gestão Documental', urlAcesso: 'https://sicod.caixa.gov.br',
    corIcone: '#FFB81C', lancamento: false, restrito: false, liberado: true, totalAcessos: 1150,
  },
  {
    id: 9, nome: 'GEDAM', sigla: 'GEDAM', descricao: 'Demandas FGTS',
    categoria: 'Habitação', areaResponsavel: 'Diretoria Habitação', urlAcesso: 'https://gedam.caixa.gov.br',
    corIcone: '#22C55E', lancamento: false, restrito: false, liberado: true, totalAcessos: 1320,
  },
];

export function getMockHomeData(favoritosIds: number[], recentIds: number[]): HomeData {
  const byId = (ids: number[]) => ids.map(id => MOCK_SISTEMAS.find(s => s.id === id)).filter(Boolean) as Sistema[];
  const favoritos = byId(favoritosIds).map(s => ({ ...s, favorito: true }));
  const ultimosAcessados = byId(recentIds.length ? recentIds : [4, 1, 2]);
  const maisAcessados = [...MOCK_SISTEMAS]
    .sort((a, b) => (b.totalAcessos ?? 0) - (a.totalAcessos ?? 0))
    .slice(0, 5);
  const lancamentos = MOCK_SISTEMAS.filter(s => s.lancamento);

  return { favoritos, lancamentos, ultimosAcessados, maisAcessados };
}

export function searchMockSistemas(
  query: string,
  page = 1,
  pageSize = 10,
  categoria?: string
): { items: Sistema[]; total: number } {
  const q = query.toLowerCase().trim();
  let filtered = MOCK_SISTEMAS;

  if (categoria) {
    filtered = filtered.filter(s => s.categoria === categoria);
  }

  if (q) {
    filtered = filtered.filter(
      s =>
        s.nome.toLowerCase().includes(q) ||
        s.sigla.toLowerCase().includes(q) ||
        s.descricao.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q)
    );
  }
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

export function buscarStatusSistemas(query: string): SistemaStatusConsulta[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return MOCK_SISTEMAS.filter(
    s =>
      s.nome.toLowerCase().includes(q) ||
      s.sigla.toLowerCase().includes(q) ||
      s.descricao.toLowerCase().includes(q) ||
      s.categoria.toLowerCase().includes(q)
  ).map(sistema => {
    const info = MOCK_STATUS_SISTEMAS[sistema.id] ?? {
      status: 'disponivel' as StatusOperacionalSistema,
      mensagem: 'Sem informação de monitoramento',
      atualizadoEm: new Date().toISOString(),
    };
    return { sistema, ...info };
  });
}
