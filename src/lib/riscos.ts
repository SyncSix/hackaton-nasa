/**
 * Riscos reais de sobrevivência na superfície de Marte.
 *
 * Fontes: NASA Science (Mars Facts), NASA "Humans to Mars", RAD/Curiosity,
 * Phoenix (percloratos), Wikipedia (Human mission to Mars).
 *
 * Os VALORES ATUAIS da missão são simulados; os LIMITES e a explicação
 * científica são reais.
 */

export type Estado = 'ok' | 'atencao' | 'critico'

export type Risco = {
  id: string
  nome: string
  /** O que é, em linguagem simples. */
  explicacao: string
  /** Por que mata ou machuca. */
  perigo: string
  /** Valor atual da missão (simulado). */
  atual: number
  unidade: string
  /** Limite operacional. */
  limite: number
  /** Direção: acima do limite é ruim, ou abaixo. */
  direcao: 'acima' | 'abaixo'
  /** Referência científica real. */
  referencia: string
  /** O que fazer se estiver fora do limite. */
  acao: string
}

export const RISCOS: Risco[] = [
  {
    id: 'radiacao',
    nome: 'Radiação',
    explicacao:
      'Marte não tem campo magnético global nem atmosfera espessa. A superfície recebe radiação cósmica e solar direto.',
    perigo:
      'Dano ao DNA, câncer e perda de função renal. A exposição se acumula durante toda a missão e não tem cura.',
    atual: 0.67,
    unidade: 'mSv/sol',
    limite: 1.0,
    direcao: 'acima',
    referencia: 'RAD/Curiosity · limite de carreira NASA: 1 Sv',
    acao: 'Reduzir tempo ao ar livre e usar abrigo com blindagem de regolito.',
  },
  {
    id: 'pressao',
    nome: 'Pressão atmosférica',
    explicacao:
      'A atmosfera marciana é 96% gás carbônico e tem cerca de 0,6% da pressão da Terra.',
    perigo:
      'Sem traje pressurizado, os fluidos corporais fervem em segundos. Não é falta de ar: é descompressão explosiva.',
    atual: 0.6,
    unidade: 'kPa',
    limite: 0.6,
    direcao: 'abaixo',
    referencia: 'NASA Mars Facts · ~0,6 kPa na superfície',
    acao: 'Nunca sair sem traje pressurizado íntegro. Verificar vedação antes da EVA.',
  },
  {
    id: 'temperatura',
    nome: 'Temperatura',
    explicacao:
      'A temperatura varia de cerca de -153 °C à noite a +20 °C ao meio-dia no equador.',
    perigo:
      'Congelamento de extremidades em minutos. O choque térmico também danifica equipamentos e vedações do traje.',
    atual: -62,
    unidade: '°C',
    limite: -40,
    direcao: 'abaixo',
    referencia: 'NASA Mars Facts · -153 °C a +20 °C',
    acao: 'Limitar EVA a janelas diurnas e monitorar aquecedores do traje.',
  },
  {
    id: 'poeira',
    nome: 'Poeira e tempestades',
    explicacao:
      'Tempestades de poeira podem cobrir o planeta inteiro e durar meses. A poeira suspensa reduz a luz solar.',
    perigo:
      'Cega sensores, cobre painéis solares e corta a geração de energia. A poeira fina também entra em juntas e filtros.',
    atual: 0.84,
    unidade: 'τ',
    limite: 1.5,
    direcao: 'acima',
    referencia: 'NASA · opacidade τ medida por MEDA/Curiosity',
    acao: 'Priorizar energia nuclear e limpar painéis. Suspender EVA acima de τ 1,5.',
  },
  {
    id: 'percloratos',
    nome: 'Percloratos no solo',
    explicacao:
      'O solo marciano contém de 0,5% a 1% de sais de perclorato, descobertos pela Phoenix.',
    perigo:
      'Bloqueiam o iodo da tireoide e causam dano pulmonar se a poeira for inalada. Tóxico em concentrações que na Terra seriam consideradas contaminação grave.',
    atual: 0.7,
    unidade: '% do solo',
    limite: 0.5,
    direcao: 'acima',
    referencia: 'Phoenix · 0,5–1% em massa',
    acao: 'Filtrar todo ar de entrada. Descontaminar trajes antes de entrar no habitat.',
  },
  {
    id: 'comunicacao',
    nome: 'Atraso de comunicação',
    explicacao:
      'O sinal de rádio leva de 4 a 24 minutos para chegar à Terra, dependendo da posição dos planetas.',
    perigo:
      'Não há ajuda em tempo real. Em emergência médica ou falha crítica, a tripulação decide sozinha.',
    atual: 14,
    unidade: 'min',
    limite: 24,
    direcao: 'acima',
    referencia: 'NASA · latência de 4 a 24 min',
    acao: 'Manter protocolos autônomos. Não depender de autorização da Terra para agir.',
  },
  {
    id: 'gravidade',
    nome: 'Gravidade reduzida',
    explicacao: 'A gravidade em Marte é 38% da terrestre.',
    perigo:
      'Perda de massa óssea, atrofia muscular e alterações cardiovasculares em estadias longas.',
    atual: 38,
    unidade: '% da Terra',
    limite: 38,
    direcao: 'abaixo',
    referencia: 'NASA · 0,38 g',
    acao: 'Manter rotina de exercício resistido diária.',
  },
]

/** Avalia o estado de um risco comparando o valor atual com o limite. */
export function avaliar(r: Risco): Estado {
  const margem = Math.abs(r.limite) * 0.15 || 0.1

  if (r.direcao === 'acima') {
    if (r.atual > r.limite) return 'critico'
    if (r.atual > r.limite - margem) return 'atencao'
    return 'ok'
  }

  if (r.atual < r.limite) return 'critico'
  if (r.atual < r.limite + margem) return 'atencao'
  return 'ok'
}

export const CORES_ESTADO: Record<Estado, { texto: string; barra: string; borda: string; rotulo: string }> = {
  ok: {
    texto: 'text-emerald-400',
    barra: 'bg-emerald-400',
    borda: 'border-emerald-400/30',
    rotulo: 'Dentro do limite',
  },
  atencao: {
    texto: 'text-alerta',
    barra: 'bg-alerta',
    borda: 'border-alerta/35',
    rotulo: 'Atenção',
  },
  critico: {
    texto: 'text-marte',
    barra: 'bg-marte',
    borda: 'border-marte/45',
    rotulo: 'Fora do limite',
  },
}
