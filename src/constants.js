export const WINE = '#7B1226';
export const WINE_LIGHT = '#9E1A33';
export const BG = '#0A0A0A';
export const BG2 = '#111111';
export const BG3 = '#181818';
export const BORDER = '#242424';
export const TEXT = '#F0EDE8';
export const MUTED = '#888';

export const GOALS = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];

export const STATUS_COLORS = {
  'A fazer': '#4A90D9',
  'Em andamento': '#F5A623',
  'Concluído': '#4CAF82',
  'Cancelado': '#888',
};

export const DEFAULT_SERVICES = [
  { id: 1, empresa: 'Tech Solutions', descricao: 'Gestão de tráfego pago', value: 3500, status: 'Concluído', date: '2026-01-15' },
  { id: 2, empresa: 'Bella Moda', descricao: 'Social media + criação de conteúdo', value: 3500, status: 'Em andamento', date: '2026-01-15' },
  { id: 3, empresa: 'Construtora Prime', descricao: 'SEO + Google Ads', value: 3500, status: 'Concluído', date: '2026-01-15' },
  { id: 4, empresa: 'Farmácia Popular', descricao: 'Meta Ads', value: 3500, status: 'A fazer', date: '2026-01-15' },
];

export const DEFAULT_CASH = [
  { id: 1, type: 'Entrada', descricao: 'Recebimento Tech Solutions', value: 3500, date: '2026-01-16' },
  { id: 2, type: 'Entrada', descricao: 'Recebimento Construtora Prime', value: 3500, date: '2026-01-16' },
  { id: 3, type: 'Entrada', descricao: 'Ferramentas SaaS', value: 3500, date: '2026-01-16' },
  { id: 4, type: 'Entrada', descricao: 'Imposto MEI', value: 3500, date: '2026-01-16' },
];
