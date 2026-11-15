/**
 * Modelo RIDGE — os cinco grandes perigos da exploração humana no espaço,
 * conforme o Human Research Program da NASA.
 *
 * R — Radiation            (radiação)
 * I — Isolation            (isolamento e confinamento)
 * D — Distance from Earth  (distância da Terra)
 * G — Gravity fields       (campos gravitacionais)
 * E — Environments         (ambientes hostis e fechados)
 */

export type Estado = 'nominal' | 'atencao' | 'critico'

export type CategoriaRidge = {
  letra: string
  id: string
  /** Nome do ícone lucide que representa a categoria. */
  icone: 'Radiation' | 'Users' | 'Satellite' | 'Weight' | 'Mountain'
  nome: string
  nomeEn: string
  descricao: string
  /** Por que isso ameaça a sobrevivência, em linguagem direta. */
  risco: string
  estado: Estado
  /** Indicadores que compõem a categoria. */
  indicadores: Array<{
    nome: string
    valor: string
    limite: string
    estado: Estado
    /** Origem do dado. */
    origem: 'simulado' | 'científico'
    /** Equipamento que fornece a medição. */
    equipamento: string
  }>
  /** Procedimento recomendado quando o estado piora. */
  resposta: string
  /** Protocolo relacionado, se houver. */
  protocolo?: string
  fonte: {
    instituicao: string
    documento: string
  }
}

export const RIDGE: CategoriaRidge[] = [
  {
    letra: 'R',
    id: 'radiation',
    icone: 'Radiation',
    nome: 'Radiação',
    nomeEn: 'Space Radiation',
    descricao:
      'Partículas energéticas do Sol e raios cósmicos atravessam o traje e o habitat. Marte não tem campo magnético global nem atmosfera densa para barrar essa exposição.',
    risco:
      'Dano ao DNA, aumento do risco de câncer e perda progressiva de função renal e do sistema nervoso central. A dose se acumula durante toda a missão.',
    estado: 'atencao',
    indicadores: [
      { nome: 'Dose diária na superfície', valor: '0,67 mSv/sol', limite: '1,0', estado: 'atencao', origem: 'simulado', equipamento: 'RAD' },
      { nome: 'Dose acumulada da missão', valor: '456 mSv', limite: '1000 (carreira)', estado: 'nominal', origem: 'simulado', equipamento: 'ACT' },
      { nome: 'Radiação e poeira', valor: '0,84 τ', limite: 'máximo 1,5', estado: 'nominal', origem: 'simulado', equipamento: 'RDS' },
    ],
    resposta:
      'Limitar tempo ao ar livre, priorizar abrigo com blindagem de regolito e monitorar a dose acumulada antes de autorizar EVA.',
    protocolo: 'ENV-002',
    fonte: {
      instituicao: 'NASA Human Research Program',
      documento: 'Space Radiation Risks',
    },
  },
  {
    letra: 'I',
    id: 'isolation',
    icone: 'Users',
    nome: 'Isolamento e confinamento',
    nomeEn: 'Isolation & Confinement',
    descricao:
      'A tripulação vive confinada em volume reduzido, longe de casa, com as mesmas pessoas por anos. Não há retorno possível em caso de crise pessoal.',
    risco:
      'Distúrbios do sono, declínio cognitivo, conflitos interpessoais e depressão. Esses fatores degradam a tomada de decisão justamente em situações de emergência.',
    estado: 'nominal',
    indicadores: [
      { nome: 'Horas de sono (média 7 dias)', valor: '6,8 h', limite: 'mínimo 7,0', estado: 'atencao', origem: 'simulado', equipamento: 'ACTI' },
      { nome: 'Carga de trabalho semanal', valor: '52 h', limite: 'máximo 48', estado: 'atencao', origem: 'simulado', equipamento: 'MEDKIT' },
      { nome: 'Avaliação psicológica', valor: 'Estável', limite: '—', estado: 'nominal', origem: 'simulado', equipamento: 'MEDKIT' },
    ],
    resposta:
      'Ajustar escala de trabalho, garantir período de descanso protegido e manter contato programado com a família durante janelas de comunicação.',
    protocolo: 'MED-001',
    fonte: {
      instituicao: 'NASA Human Research Program',
      documento: 'Isolation and Confinement',
    },
  },
  {
    letra: 'D',
    id: 'distance',
    icone: 'Satellite',
    nome: 'Distância da Terra',
    nomeEn: 'Distance from Earth',
    descricao:
      'O sinal de rádio leva de 4 a 24 minutos para chegar à Terra, dependendo da posição dos planetas. Em conjunção solar, a comunicação pode ser interrompida por semanas.',
    risco:
      'Não existe ajuda em tempo real. Em uma emergência médica ou falha crítica, a tripulação precisa decidir sozinha e arcar com as consequências.',
    estado: 'critico',
    indicadores: [
      { nome: 'Atraso de comunicação', valor: '14 min', limite: 'operar autônomo', estado: 'atencao', origem: 'simulado', equipamento: 'DSL' },
      { nome: 'Próxima janela de relay', valor: '1 h 15', limite: 'máximo 6 h', estado: 'nominal', origem: 'simulado', equipamento: 'RELAY' },
      { nome: 'Autonomia de decisão', valor: 'Não certificada', limite: 'obrigatória', estado: 'critico', origem: 'simulado', equipamento: 'RELAY' },
    ],
    resposta:
      'Manter protocolos autônomos documentados. Não depender de autorização da Terra para ações de sobrevivência imediata.',
    protocolo: 'COM-001',
    fonte: {
      instituicao: 'NASA',
      documento: 'Mars Communication Delays',
    },
  },
  {
    letra: 'G',
    id: 'gravity',
    icone: 'Weight',
    nome: 'Campos gravitacionais',
    nomeEn: 'Gravity Fields',
    descricao:
      'A gravidade em Marte é 38% da terrestre. A adaptação física ocorre ao longo de meses e não é totalmente reversível durante a missão.',
    risco:
      'Perda de massa óssea, atrofia muscular e alterações cardiovasculares. Aumenta o risco de fratura e reduz a capacidade de trabalho físico em EVA.',
    estado: 'nominal',
    indicadores: [
      { nome: 'Gravidade local', valor: '0,38 g', limite: '—', estado: 'nominal', origem: 'científico', equipamento: 'DXA' },
      { nome: 'Densidade óssea (variação)', valor: '−4,2%', limite: 'máximo −6%', estado: 'nominal', origem: 'simulado', equipamento: 'DXA' },
      { nome: 'Rotina de exercício', valor: 'Adesão 91%', limite: 'mínimo 80%', estado: 'nominal', origem: 'simulado', equipamento: 'ARED' },
    ],
    resposta:
      'Manter exercício resistido diário e monitorar densidade óssea a cada 30 sóis.',
    protocolo: 'MED-002',
    fonte: {
      instituicao: 'NASA Human Research Program',
      documento: 'Gravity Fields and Bone Loss',
    },
  },
  {
    letra: 'E',
    id: 'environments',
    icone: 'Mountain',
    nome: 'Ambientes hostis',
    nomeEn: 'Hostile & Closed Environments',
    descricao:
      'Atmosfera de 96% CO₂ a ~0,6 kPa, temperatura de −153 °C a +20 °C, poeira tóxica com percloratos e tempestades que duram meses.',
    risco:
      'Descompressão explosiva sem traje, congelação em minutos, intoxicação por percloratos e perda de geração de energia em tempestades longas.',
    estado: 'critico',
    indicadores: [
      { nome: 'Temperatura externa', valor: '−62 °C', limite: 'mínimo −40', estado: 'critico', origem: 'simulado', equipamento: 'MEDA' },
      { nome: 'Pressão externa', valor: '0,6 kPa', limite: '0,6', estado: 'atencao', origem: 'científico', equipamento: 'REMS' },
      { nome: 'Opacidade de poeira (τ)', valor: '0,84', limite: 'máximo 1,5', estado: 'nominal', origem: 'simulado', equipamento: 'RDS' },
      { nome: 'Percloratos no solo', valor: '0,7%', limite: 'máximo 0,5', estado: 'critico', origem: 'científico', equipamento: 'WATSON' },
    ],
    resposta:
      'Não autorizar EVA com temperatura abaixo de −40 °C. Filtrar todo ar de entrada e descontaminar trajes antes de entrar no habitat.',
    protocolo: 'ENV-001',
    fonte: {
      instituicao: 'NASA Science',
      documento: 'Mars Facts · Phoenix Perchlorate Findings',
    },
  },
]

/** Contagem de categorias por estado. */
export function resumoRidge() {
  return {
    nominal: RIDGE.filter((r) => r.estado === 'nominal').length,
    atencao: RIDGE.filter((r) => r.estado === 'atencao').length,
    critico: RIDGE.filter((r) => r.estado === 'critico').length,
  }
}

export const CORES: Record<Estado, { texto: string; bg: string; borda: string; rotulo: string }> = {
  nominal: {
    texto: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    borda: 'border-emerald-400/30',
    rotulo: 'Nominal',
  },
  atencao: {
    texto: 'text-alerta',
    bg: 'bg-alerta/10',
    borda: 'border-alerta/35',
    rotulo: 'Atenção',
  },
  critico: {
    texto: 'text-critico',
    bg: 'bg-critico/10',
    borda: 'border-critico/45',
    rotulo: 'Crítico',
  },
}
