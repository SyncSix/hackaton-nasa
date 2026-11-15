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

/**
 * Gestão de resíduos e voláteis.
 *
 * O ECLSS não remove só CO₂: umidade, amônia, metano e voláteis orgânicos
 * também circulam. Acúmulo de voláteis é invisível e tóxico.
 */
export type FluxoResiduo = {
  id: string
  nome: string
  /** Taxa atual medida, na unidade indicada. */
  valor: number
  unidade: string
  /** Limite aceitável. */
  limite: number
  /** Direção do risco. */
  risco: 'alto' | 'baixo'
  sistema: string
  efeito: string
}

export const RESIDUOS: FluxoResiduo[] = [
  {
    id: 'umidade',
    nome: 'Remoção de umidade',
    valor: 58,
    unidade: '% UR',
    limite: 75,
    risco: 'alto',
    sistema: 'Condensador · ARF',
    efeito: 'Condensação em paredes e equipamentos, risco de mofo e corrosão.',
  },
  {
    id: 'volateis',
    nome: 'Voláteis orgânicos',
    valor: 0.9,
    unidade: 'mg/m³',
    limite: 1.2,
    risco: 'alto',
    sistema: 'Leito de carvão ativado · TCCS',
    efeito: 'Irritação de mucosas, dor de cabeça e, em acúmulo, toxicidade hepática.',
  },
  {
    id: 'amonia',
    nome: 'Amônia',
    valor: 4.2,
    unidade: 'ppm',
    limite: 25,
    risco: 'alto',
    sistema: 'Oxidador catalítico',
    efeito: 'Irritação respiratória; indica falha no tratamento de urina.',
  },
  {
    id: 'metano',
    nome: 'Metano e traços',
    valor: 12,
    unidade: 'ppm',
    limite: 50,
    risco: 'alto',
    sistema: 'Reator Sabatier · ventilação',
    efeito: 'Desloca oxigênio por diluição e indica saturação do reator.',
  },
  {
    id: 'recuperacao',
    nome: 'Recuperação de água',
    valor: 93,
    unidade: '%',
    limite: 85,
    risco: 'baixo',
    sistema: 'WRS · Water Recovery System',
    efeito: 'Abaixo de 85% a reserva cai rápido; sem reabastecimento não há reposição.',
  },
]

export type ResultadoGas = 'nominal' | 'atencao' | 'critico'

/** Avalia um fluxo de resíduo. */
export function avaliarResiduo(r: FluxoResiduo): ResultadoGas {
  if (r.risco === 'alto') {
    if (r.valor > r.limite) return 'critico'
    if (r.valor > r.limite * 0.8) return 'atencao'
    return 'nominal'
  }
  if (r.valor < r.limite) return 'critico'
  if (r.valor < r.limite * 1.1) return 'atencao'
  return 'nominal'
}

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
