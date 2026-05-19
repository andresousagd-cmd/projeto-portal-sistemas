import { HomeData, Sistema, Usuario } from '../models';

export const MOCK_USUARIOS: Record<string, Usuario> = {
  C000001: { id: 1, matricula: 'C000001', nome: 'Maria Silva', area: 'Atendimento - Agência Centro' },
  C000002: { id: 2, matricula: 'C000002', nome: 'João Santos', area: 'Habitação - Regional SP' },
  C000003: { id: 3, matricula: 'C000003', nome: 'Ana Oliveira', area: 'Crédito - Matriz' },
};

export const MOCK_SISTEMAS: Sistema[] = [
  {
    id: 1, nome: 'SIOP', sigla: 'SIOP', descricao: 'Sistema Integrado de Operações',
    categoria: 'Operações', areaResponsavel: 'TI Corporativa', urlAcesso: 'https://siop.caixa.gov.br',
    corIcone: '#003B7E', lancamento: false, restrito: false, liberado: true, totalAcessos: 1250,
  },
  {
    id: 2, nome: 'FGTS Operacional', sigla: 'FGTS', descricao: 'Gestão operacional do FGTS para atendimento',
    categoria: 'Habitação', areaResponsavel: 'Diretoria Habitação', urlAcesso: 'https://fgts.caixa.gov.br',
    corIcone: '#22C55E', lancamento: true, restrito: false, liberado: true, totalAcessos: 980,
  },
  {
    id: 3, nome: 'SIPAC', sigla: 'SIPAC', descricao: 'Sistema de Patrimônio e Almoxarifado Corporativo',
    categoria: 'Administrativo', areaResponsavel: 'Suprimentos', urlAcesso: 'https://sipac.caixa.gov.br',
    corIcone: '#FFB81C', lancamento: false, restrito: true, liberado: false, totalAcessos: 420,
  },
  {
    id: 4, nome: 'SICOV', sigla: 'SICOV', descricao: 'Sistema de Convênios e Parcerias',
    categoria: 'Convênios', areaResponsavel: 'Relações Institucionais', urlAcesso: 'https://sicov.caixa.gov.br',
    corIcone: '#005EB8', lancamento: true, restrito: false, liberado: true, totalAcessos: 760,
  },
  {
    id: 5, nome: 'SINAT', sigla: 'SINAT', descricao: 'Sistema Nacional de Atendimento',
    categoria: 'Atendimento', areaResponsavel: 'Rede de Agências', urlAcesso: 'https://sinat.caixa.gov.br',
    corIcone: '#003B7E', lancamento: false, restrito: false, liberado: true, totalAcessos: 2100,
  },
  {
    id: 6, nome: 'SICAC', sigla: 'SICAC', descricao: 'Sistema de Cadastro de Clientes',
    categoria: 'Cadastro', areaResponsavel: 'Diretoria de Negócios', urlAcesso: 'https://sicac.caixa.gov.br',
    corIcone: '#64748B', lancamento: false, restrito: false, liberado: true, totalAcessos: 1890,
  },
  {
    id: 7, nome: 'SIPES', sigla: 'SIPES', descricao: 'Sistema de Pessoal e Folha de Pagamento',
    categoria: 'RH', areaResponsavel: 'Recursos Humanos', urlAcesso: 'https://sipes.caixa.gov.br',
    corIcone: '#005EB8', lancamento: false, restrito: true, liberado: false, totalAcessos: 310,
  },
  {
    id: 8, nome: 'SICONV', sigla: 'SICONV', descricao: 'Portal de Convênios Federais',
    categoria: 'Convênios', areaResponsavel: 'Governo', urlAcesso: 'https://siconv.caixa.gov.br',
    corIcone: '#22C55E', lancamento: true, restrito: false, liberado: true, totalAcessos: 540,
  },
];

export function getMockHomeData(favoritosIds: number[], recentIds: number[]): HomeData {
  const byId = (ids: number[]) => ids.map(id => MOCK_SISTEMAS.find(s => s.id === id)).filter(Boolean) as Sistema[];
  const favoritos = byId(favoritosIds).map(s => ({ ...s, favorito: true }));
  const ultimosAcessados = byId(recentIds.length ? recentIds : [2, 1, 5]);
  const maisAcessados = [...MOCK_SISTEMAS]
    .sort((a, b) => (b.totalAcessos ?? 0) - (a.totalAcessos ?? 0))
    .slice(0, 5);
  const lancamentos = MOCK_SISTEMAS.filter(s => s.lancamento);

  return { favoritos, lancamentos, ultimosAcessados, maisAcessados };
}

export function searchMockSistemas(query: string, page = 1, pageSize = 10): { items: Sistema[]; total: number } {
  const q = query.toLowerCase().trim();
  const filtered = q
    ? MOCK_SISTEMAS.filter(
        s =>
          s.nome.toLowerCase().includes(q) ||
          s.sigla.toLowerCase().includes(q) ||
          s.descricao.toLowerCase().includes(q) ||
          s.categoria.toLowerCase().includes(q)
      )
    : MOCK_SISTEMAS;
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}
