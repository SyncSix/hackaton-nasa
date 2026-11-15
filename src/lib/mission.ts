/**
 * Estado da missão.
 *
 * ATENÇÃO: consumíveis, radiação acumulada e janelas de comunicação são
 * valores SIMULADOS para demonstração. Não representam telemetria real de
 * nenhum habitat ou missão. A interface marca esses dados como simulados.
 */

export type Consumivel = {
  id: string
  nome: string
  unidade: string
  atual: number
  capacidade: number
  consumoPorSol: number
  critico: number
}

export type Tripulante = {
  nome: string
  funcao: string
  status: 'nominal' | 'atencao'
}

export const MISSAO = {
  nome: 'S6 Marte',
  local: 'Cratera Jezero',
  /** Sol marciano de referência. 1.742 corresponde a mai/2026 em Jezero. */
  sol: 1742,
  /** Hora local média (LMST) inicial. O relógio avança a partir dela. */
  lmstInicial: '14:32:07',
  tripulacao: 4,
  proximoRelay: 'Odyssey em 1 h 15 min',
  relayLocal: 'HAB / Perseverance',
  coordenadas: '18.4°N · 77.5°E',
}

export const CONSUMIVEIS: Consumivel[] = [
  {
    id: 'o2',
    nome: 'Oxigênio',
    unidade: 'kg',
    atual: 412,
    capacidade: 600,
    consumoPorSol: 3.2,
    critico: 25,
  },
  {
    id: 'agua',
    nome: 'Água',
    unidade: 'L',
    atual: 890,
    capacidade: 1200,
    consumoPorSol: 8.4,
    critico: 20,
  },
  {
    id: 'energia',
    nome: 'Energia',
    unidade: 'kWh',
    atual: 1240,
    capacidade: 2000,
    consumoPorSol: 42,
    critico: 30,
  },
  {
    id: 'alimento',
    nome: 'Alimento',
    unidade: 'kg',
    atual: 186,
    capacidade: 400,
    consumoPorSol: 2.1,
    critico: 15,
  },
]

export const TRIPULACAO: Tripulante[] = [
  { nome: 'Cdr. A. Vasquez', funcao: 'Comandante', status: 'nominal' },
  { nome: 'Dr. L. Okonkwo', funcao: 'Geóloga', status: 'nominal' },
  { nome: 'Eng. M. Tanaka', funcao: 'Engenheiro de sistemas', status: 'nominal' },
  { nome: 'Dr. R. Silva', funcao: 'Médico de voo', status: 'atencao' },
]

export type AlvoCientifico = {
  id: string
  nome: string
  tipo: string
  distanciaKm: number
  prioridade: 'alta' | 'média' | 'baixa'
  status: 'acessível' | 'restrito'
}

export const ALVOS: AlvoCientifico[] = [
  { id: 'T1', nome: 'Afloramento sedimentar Norte', tipo: 'Geologia', distanciaKm: 1.8, prioridade: 'alta', status: 'acessível' },
  { id: 'T2', nome: 'Campo de dunas ativas', tipo: 'Geomorfologia', distanciaKm: 3.4, prioridade: 'média', status: 'restrito' },
  { id: 'T3', nome: 'Cratera de impacto secundária', tipo: 'Geologia', distanciaKm: 5.1, prioridade: 'alta', status: 'acessível' },
  { id: 'T4', nome: 'Veios de sulfato', tipo: 'Mineralogia', distanciaKm: 2.6, prioridade: 'média', status: 'acessível' },
]

export type Waypoint = {
  id: string
  nome: string
  /** Distância acumulada desde o habitat, em km. */
  kmBase: number
  tipo: 'base' | 'alvo' | 'abrigo' | 'ponto'
  /** Trecho de terreno duvidoso? Exige alternativa. */
  terrenoDuvidoso: boolean
  /** Tem linha de visão com o habitat. */
  linhaVisao: boolean
}

export type Rota = {
  id: string
  nome: string
  distanciaKm: number
  duracao: string
  inclinacaoMax: number
  o2Necessario: number
  risco: 'baixo' | 'moderado' | 'alto'
  descricao: string
  /** Pontos de passagem obrigatórios. */
  waypoints: Waypoint[]
  /** Desvio programado para o trecho de maior risco. */
  alternativa?: string
  /** Distância máxima do habitat em qualquer ponto do trajeto. */
  raioMaxKm: number
  /** Abrigo mais próximo do ponto mais distante. */
  abrigoMaisProximo: string
  /** Minutos até o abrigo a partir do ponto mais distante. */
  tempoAbrigoMin: number
}

export const ROTAS: Rota[] = [
  {
    id: 'R1',
    nome: 'Máximo científico',
    distanciaKm: 7.2,
    duracao: '4 h 20 min',
    inclinacaoMax: 24,
    o2Necessario: 62,
    risco: 'moderado',
    descricao: 'Passa por três alvos prioritários. Atravessa encosta de 24°.',
    waypoints: [
      { id: 'W0', nome: 'Habitat', kmBase: 0, tipo: 'base', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W1', nome: 'Afloramento Norte', kmBase: 1.8, tipo: 'alvo', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W2', nome: 'Base da encosta', kmBase: 3.2, tipo: 'ponto', terrenoDuvidoso: true, linhaVisao: true },
      { id: 'W3', nome: 'Topo da encosta', kmBase: 4.4, tipo: 'ponto', terrenoDuvidoso: true, linhaVisao: false },
      { id: 'W4', nome: 'Cratera secundária', kmBase: 5.9, tipo: 'alvo', terrenoDuvidoso: false, linhaVisao: false },
      { id: 'W5', nome: 'Veios de sulfato', kmBase: 6.6, tipo: 'alvo', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W0r', nome: 'Habitat (retorno)', kmBase: 0, tipo: 'base', terrenoDuvidoso: false, linhaVisao: true },
    ],
    alternativa:
      'Contorna a encosta pelo sul: +1,4 km e +22 min, inclinação máxima cai de 24° para 14°.',
    raioMaxKm: 3.6,
    abrigoMaisProximo: 'Cache de emergência',
    tempoAbrigoMin: 14,
  },
  {
    id: 'R2',
    nome: 'Segurança e economia',
    distanciaKm: 5.8,
    duracao: '3 h 05 min',
    inclinacaoMax: 11,
    o2Necessario: 49,
    risco: 'baixo',
    descricao: 'Terreno plano, dois alvos. Menor consumo de oxigênio.',
    waypoints: [
      { id: 'W0', nome: 'Habitat', kmBase: 0, tipo: 'base', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W1', nome: 'Afloramento Norte', kmBase: 1.8, tipo: 'alvo', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W2', nome: 'Veios de sulfato', kmBase: 2.6, tipo: 'alvo', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W3', nome: 'Ponto de retorno', kmBase: 3.4, tipo: 'ponto', terrenoDuvidoso: false, linhaVisao: true },
      { id: 'W0r', nome: 'Habitat (retorno)', kmBase: 0, tipo: 'base', terrenoDuvidoso: false, linhaVisao: true },
    ],
    raioMaxKm: 2.4,
    abrigoMaisProximo: 'Habitat principal',
    tempoAbrigoMin: 6,
  },
]

/** Calcula dias restantes de um consumível com a tripulação atual. */
export function diasRestantes(c: Consumivel): number {
  const consumoDiario = c.consumoPorSol * MISSAO.tripulacao
  if (consumoDiario <= 0) return Infinity
  return Math.floor(c.atual / consumoDiario)
}

/** Percentual restante em relação à capacidade. */
export function percentual(c: Consumivel): number {
  return Math.round((c.atual / c.capacidade) * 100)
}

/** Classifica o estado do consumível. */
export function estadoConsumivel(c: Consumivel): 'nominal' | 'atencao' | 'critico' {
  const pct = percentual(c)
  if (pct <= c.critico) return 'critico'
  if (pct <= c.critico * 1.6) return 'atencao'
  return 'nominal'
}
