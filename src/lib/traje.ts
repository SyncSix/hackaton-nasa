/**
 * PLSS — Portable Life Support System.
 *
 * A mochila do traje. Fornece oxigênio, remove CO₂, controla temperatura e
 * pressão. Se ela falha, o astronauta tem o tempo de "walkback" para voltar.
 *
 * Os valores atuais são SIMULADOS. A arquitetura e as grandezas monitoradas
 * seguem o que o PLSS real controla (NASA ECLSS / xEMU).
 */

export type ConsumivelTraje = {
  id: string
  nome: string
  /** Sigla do subsistema. */
  subsistema: string
  atual: number
  capacidade: number
  unidade: string
  /** Taxa de consumo por hora de EVA. */
  taxaHora: number
  /** Limite abaixo do qual exige retorno. */
  limiteRetorno: number
  /** O que acontece se zerar. */
  consequencia: string
}

export const PLSS: ConsumivelTraje[] = [
  {
    id: 'o2',
    nome: 'Oxigênio',
    subsistema: 'O₂ primário',
    atual: 78,
    capacidade: 100,
    unidade: '%',
    taxaHora: 9.5,
    limiteRetorno: 25,
    consequencia: 'Hipóxia e perda de consciência sem aviso prévio.',
  },
  {
    id: 'co2',
    nome: 'Remoção de CO₂',
    subsistema: 'Leito de LiOH',
    atual: 64,
    capacidade: 100,
    unidade: '% de capacidade',
    taxaHora: 11,
    limiteRetorno: 20,
    consequencia: 'Acúmulo de CO₂ no traje: dor de cabeça, confusão e perda de consciência.',
  },
  {
    id: 'agua',
    nome: 'Água de resfriamento',
    subsistema: 'LCVG',
    atual: 71,
    capacidade: 100,
    unidade: '%',
    taxaHora: 8,
    limiteRetorno: 20,
    consequencia: 'Superaquecimento do traje e risco de insolação.',
  },
  {
    id: 'bateria',
    nome: 'Bateria',
    subsistema: 'Energia do PLSS',
    atual: 82,
    capacidade: 100,
    unidade: '%',
    taxaHora: 7.5,
    limiteRetorno: 30,
    consequencia: 'Perda de ventilação, comunicação e aquecimento.',
  },
]

/** Horas de autonomia restantes até o limite de retorno. */
export function horasAteRetorno(c: ConsumivelTraje): number {
  const margem = c.atual - c.limiteRetorno
  if (margem <= 0) return 0
  return margem / c.taxaHora
}

/** O recurso mais restritivo define a autonomia real da EVA. */
export function autonomiaEva(): { horas: number; critico: ConsumivelTraje } {
  const avaliados = PLSS.map((c) => ({ c, h: horasAteRetorno(c) }))
  const pior = avaliados.reduce((a, b) => (b.h < a.h ? b : a))
  return { horas: pior.h, critico: pior.c }
}

/** Estado de um consumível do traje. */
export function estadoTraje(c: ConsumivelTraje): 'nominal' | 'atencao' | 'critico' {
  const pct = (c.atual / c.capacidade) * 100
  if (pct <= c.limiteRetorno) return 'critico'
  if (pct <= c.limiteRetorno * 1.5) return 'atencao'
  return 'nominal'
}

/**
 * Limite de distância a pé (walkback).
 *
 * Regra: o astronauta precisa conseguir voltar ao habitat caminhando caso o
 * veículo falhe. A distância máxima é a autonomia restante do traje dividida
 * pelo tempo de retorno, com margem de segurança.
 */
export function limiteCaminhada(horasAutonomia: number, velocidadeKmH = 1.6): number {
  // Metade da autonomia para a ida, metade para o retorno, com 20% de margem.
  const horasIda = (horasAutonomia * 0.8) / 2
  return horasIda * velocidadeKmH
}
