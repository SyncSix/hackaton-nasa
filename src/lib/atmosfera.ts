/**
 * Balanço atmosférico do habitat.
 *
 * O ECLSS mantém pressão, remove CO₂ e repõe O₂. Exibir só o O₂ é insuficiente:
 * o CO₂ pode subir enquanto o O₂ parece normal — e é o CO₂ que derruba a
 * consciência primeiro em ambiente fechado.
 *
 * Valores SIMULADOS. Limites seguem referências de ECLSS/ISS e de fisiologia
 * humana em ambiente pressurizado.
 */

export type GasAtmosferico = {
  id: string
  nome: string
  formula?: string
  valor: number
  unidade: string
  /** Faixa considerada segura. */
  min: number
  max: number
  /** Limite onde a situação é crítica. */
  limiteCritico: number
  /** Sistema que controla a grandeza. */
  sistema: string
  /** O que acontece fora da faixa. */
  efeito: string
  /** Direção de risco: acima do máximo ou abaixo do mínimo. */
  risco: 'alto' | 'baixo'
}

export const ATMOSFERA: GasAtmosferico[] = [
  {
    id: 'o2',
    nome: 'Oxigênio',
    formula: 'O₂',
    valor: 20.9,
    unidade: '%',
    min: 19.5,
    max: 23.5,
    limiteCritico: 16,
    sistema: 'OGS · Oxygen Generation Assembly',
    efeito: 'Abaixo de 19,5%: hipóxia. Acima de 23,5%: risco de incêndio.',
    risco: 'baixo',
  },
  {
    id: 'co2',
    nome: 'Dióxido de carbono',
    formula: 'CO₂',
    valor: 0.42,
    unidade: '%',
    min: 0,
    max: 0.4,
    limiteCritico: 1.0,
    sistema: 'CDRA · Carbon Dioxide Removal Assembly',
    efeito:
      'Acima de 0,4%: dor de cabeça e sonolência. Acima de 1%: confusão e perda de consciência.',
    risco: 'alto',
  },
  {
    id: 'n2',
    nome: 'Nitrogênio',
    formula: 'N₂',
    valor: 78.0,
    unidade: '%',
    min: 76,
    max: 80,
    limiteCritico: 74,
    sistema: 'Buffer de pressão',
    efeito: 'Fora da faixa: desbalanceia a pressão parcial dos demais gases.',
    risco: 'baixo',
  },
  {
    id: 'umidade',
    nome: 'Umidade relativa',
    valor: 58,
    unidade: '%',
    min: 25,
    max: 75,
    limiteCritico: 85,
    sistema: 'ARF · Air Revitalization',
    efeito: 'Alta: condensação, mofo e corrosão. Baixa: ressecamento de vias aéreas.',
    risco: 'alto',
  },
  {
    id: 'pressao',
    nome: 'Pressão total',
    formula: 'kPa',
    valor: 101.3,
    unidade: 'kPa',
    min: 95,
    max: 105,
    limiteCritico: 80,
    sistema: 'Controle de pressão do habitat',
    efeito: 'Queda: descompressão. Alta: risco estrutural.',
    risco: 'baixo',
  },
]

export type ResultadoGas = 'nominal' | 'atencao' | 'critico'

/** Avalia uma grandeza atmosférica contra a faixa segura. */
export function avaliarGas(g: GasAtmosferico): ResultadoGas {
  if (g.risco === 'alto') {
    if (g.valor >= g.limiteCritico) return 'critico'
    if (g.valor > g.max) return 'atencao'
    return 'nominal'
  }
  // Risco por baixo
  if (g.valor <= g.limiteCritico) return 'critico'
  if (g.valor < g.min) return 'atencao'
  return 'nominal'
}

/**
 * Índice de permanência segura baseado na concentração de CO₂.
 * Referência: a exposição contínua acima de 0,4% já causa prejuízo cognitivo.
 */
export function riscoCo2(): { pct: number; nivel: ResultadoGas } {
  const co2 = ATMOSFERA.find((g) => g.id === 'co2')!
  const uso = Math.min(100, (co2.valor / co2.limiteCritico) * 100)
  return { pct: Math.round(uso), nivel: avaliarGas(co2) }
}
