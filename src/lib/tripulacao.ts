/**
 * Status médico e operacional da tripulação.
 *
 * O sistema mostrava funções e nomes, mas não sabia responder a pergunta mais
 * básica de uma emergência: quem está apto a trabalhar? Quem está em EVA?
 * Quem está ferido e onde?
 *
 * Valores SIMULADOS.
 */

export type LocalTripulante = 'habitat' | 'eva' | 'rover' | 'dormindo'
export type Aptidao = 'apto' | 'restrição' | 'inapto'

export type TripulanteStatus = {
  id: string
  nome: string
  funcao: string
  /** Papel em emergência. */
  papelEmergencia: string
  local: LocalTripulante
  aptidao: Aptidao
  /** Bateria do traje, quando em EVA. */
  plssPct?: number
  /** Horas de sono nas últimas 24h. */
  sonoH: number
  /** Dose de radiação acumulada individual. */
  doseMsv: number
  /** Observação clínica, se houver. */
  observacao?: string
}

export const TRIPULACAO_STATUS: TripulanteStatus[] = [
  {
    id: 'T1',
    nome: 'Ana Ribeiro',
    funcao: 'Comandante',
    papelEmergencia: 'Coordena e decide',
    local: 'habitat',
    aptidao: 'apto',
    sonoH: 7.2,
    doseMsv: 288,
  },
  {
    id: 'T2',
    nome: 'Miguel Costa',
    funcao: 'Engenheiro de voo',
    papelEmergencia: 'Sistemas e estrutura',
    local: 'eva',
    aptidao: 'apto',
    plssPct: 71,
    sonoH: 6.8,
    doseMsv: 302,
  },
  {
    id: 'T3',
    nome: 'Sofia Almeida',
    funcao: 'Médica de voo',
    papelEmergencia: 'Saúde da tripulação',
    local: 'habitat',
    aptidao: 'apto',
    sonoH: 7.5,
    doseMsv: 271,
  },
  {
    id: 'T4',
    nome: 'Rui Teixeira',
    funcao: 'Especialista científica',
    papelEmergencia: 'Amostras e dados',
    local: 'dormindo',
    aptidao: 'restrição',
    sonoH: 4.5,
    doseMsv: 306,
    observacao: 'Privação de sono há 6 sóis. Evitar tarefas críticas.',
  },
]

export const CORES_APTIDAO: Record<Aptidao, { texto: string; rotulo: string; estado: 'nominal' | 'atencao' | 'critico' }> = {
  apto: { texto: 'text-nominal', rotulo: 'Apto', estado: 'nominal' },
  restrição: { texto: 'text-alerta', rotulo: 'Restrição', estado: 'atencao' },
  inapto: { texto: 'text-critico', rotulo: 'Inapto', estado: 'critico' },
}

export const ROTULO_LOCAL: Record<LocalTripulante, string> = {
  habitat: 'Habitat',
  eva: 'Em EVA',
  rover: 'No rover',
  dormindo: 'Dormindo',
}

/** Quem está disponível para responder a uma emergência agora. */
export function disponiveis(): TripulanteStatus[] {
  return TRIPULACAO_STATUS.filter((t) => t.local !== 'eva' && t.aptidao !== 'inapto')
}

/** Quantos estão fora do habitat. */
export function foraDoHabitat(): number {
  return TRIPULACAO_STATUS.filter((t) => t.local === 'eva' || t.local === 'rover').length
}
