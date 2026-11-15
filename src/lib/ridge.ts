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

import { t } from './i18n'

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
    nome: t('Radiação'),
    nomeEn: 'Space Radiation',
    descricao: t(
      'Partículas energéticas do Sol e raios cósmicos atravessam o traje e o habitat. Marte não tem campo magnético global nem atmosfera densa para barrar essa exposição.',
    ),
    risco: t(
      'Dano ao DNA, aumento do risco de câncer e perda progressiva de função renal e do sistema nervoso central. A dose se acumula durante toda a missão.',
    ),
    estado: 'atencao',
    indicadores: [
      { nome: t('Dose diária na superfície'), valor: '0,67 mSv/sol', limite: '1,0', estado: 'atencao', origem: 'simulado', equipamento: 'RAD' },
      { nome: t('Dose acumulada da missão'), valor: '1.167 mSv', limite: t('1000 (carreira)'), estado: 'critico', origem: 'simulado', equipamento: 'ACT' },
      { nome: t('Radiação e poeira'), valor: '0,84 τ', limite: t('máximo 1,5'), estado: 'nominal', origem: 'simulado', equipamento: 'RDS' },
    ],
    resposta: t(
      'Limitar tempo ao ar livre, priorizar abrigo com blindagem de regolito e monitorar a dose acumulada antes de autorizar EVA.',
    ),
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
    nome: t('Isolamento e confinamento'),
    nomeEn: 'Isolation & Confinement',
    descricao: t(
      'A tripulação vive confinada em volume reduzido, longe de casa, com as mesmas pessoas por anos. Não há retorno possível em caso de crise pessoal.',
    ),
    risco: t(
      'Distúrbios do sono, declínio cognitivo, conflitos interpessoais e depressão. Esses fatores degradam a tomada de decisão justamente em situações de emergência.',
    ),
    estado: 'nominal',
    indicadores: [
      { nome: t('Horas de sono (média 7 dias)'), valor: '6,8 h', limite: t('mínimo 7,0'), estado: 'atencao', origem: 'simulado', equipamento: 'ACTI' },
      { nome: t('Carga de trabalho semanal'), valor: '52 h', limite: t('máximo 48'), estado: 'atencao', origem: 'simulado', equipamento: 'MEDKIT' },
      { nome: t('Avaliação psicológica'), valor: t('Estável'), limite: '—', estado: 'nominal', origem: 'simulado', equipamento: 'MEDKIT' },
    ],
    resposta: t(
      'Ajustar escala de trabalho, garantir período de descanso protegido e manter contato programado com a família durante janelas de comunicação.',
    ),
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
    nome: t('Distância da Terra'),
    nomeEn: 'Distance from Earth',
    descricao: t(
      'O sinal de rádio leva de 4 a 24 minutos para chegar à Terra, dependendo da posição dos planetas. Em conjunção solar, a comunicação pode ser interrompida por semanas.',
    ),
    risco: t(
      'Não existe ajuda em tempo real. Em uma emergência médica ou falha crítica, a tripulação precisa decidir sozinha e arcar com as consequências.',
    ),
    estado: 'critico',
    indicadores: [
      { nome: t('Atraso de comunicação'), valor: '14 min', limite: t('operar autônomo'), estado: 'atencao', origem: 'simulado', equipamento: 'DSL' },
      { nome: t('Próxima janela de relay'), valor: '1 h 15', limite: t('máximo 6 h'), estado: 'nominal', origem: 'simulado', equipamento: 'RELAY' },
      { nome: t('Autonomia de decisão'), valor: t('Não certificada'), limite: t('obrigatória'), estado: 'critico', origem: 'simulado', equipamento: 'RELAY' },
    ],
    resposta: t(
      'Manter protocolos autônomos documentados. Não depender de autorização da Terra para ações de sobrevivência imediata.',
    ),
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
    nome: t('Campos gravitacionais'),
    nomeEn: 'Gravity Fields',
    descricao: t(
      'A gravidade em Marte é 38% da terrestre. A adaptação física ocorre ao longo de meses e não é totalmente reversível durante a missão.',
    ),
    risco: t(
      'Perda de massa óssea, atrofia muscular e alterações cardiovasculares. A radiação galáctica agrava o risco renal: estudo da UCL de 2024 aponta perda de função renal crescente com o tempo de exposição. Juntos, reduzem a capacidade de trabalho em EVA e o tempo de permanência seguro.',
    ),
    estado: 'nominal',
    indicadores: [
      { nome: t('Gravidade local'), valor: '0,38 g', limite: '—', estado: 'nominal', origem: 'científico', equipamento: 'DXA' },
      { nome: t('Densidade óssea (variação)'), valor: '−4,2%', limite: t('máximo −6%'), estado: 'nominal', origem: 'simulado', equipamento: 'DXA' },
      { nome: t('Rotina de exercício'), valor: t('Adesão 91%'), limite: t('mínimo 80%'), estado: 'nominal', origem: 'simulado', equipamento: 'ARED' },
      { nome: t('Volume cardíaco e fluxo'), valor: '−3,8%', limite: t('máximo −5%'), estado: 'nominal', origem: 'simulado', equipamento: 'ECO' },
      { nome: t('Função renal'), valor: 'eGFR 92', limite: t('mínimo 60'), estado: 'nominal', origem: 'simulado', equipamento: 'BIOQ' },
    ],
    resposta: t(
      'Manter exercício resistido diário e monitorar densidade óssea a cada 30 sóis.',
    ),
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
    nome: t('Ambientes hostis'),
    nomeEn: 'Hostile & Closed Environments',
    descricao: t(
      'Atmosfera de 96% CO₂ a ~0,6 kPa, temperatura de −153 °C a +20 °C, poeira tóxica com percloratos e tempestades que duram meses.',
    ),
    risco: t(
      'Descompressão explosiva sem traje, congelação em minutos, intoxicação por percloratos e perda de geração de energia em tempestades longas.',
    ),
    estado: 'critico',
    indicadores: [
      { nome: t('Temperatura externa'), valor: '−62 °C', limite: t('mínimo −40'), estado: 'critico', origem: 'simulado', equipamento: 'MEDA' },
      { nome: t('Pressão externa'), valor: '0,6 kPa', limite: t('constante'), estado: 'nominal', origem: 'científico', equipamento: 'REMS' },
      { nome: t('Opacidade de poeira (τ)'), valor: '0,84', limite: t('máximo 1,5'), estado: 'nominal', origem: 'simulado', equipamento: 'RDS' },
      { nome: t('Percloratos no solo'), valor: '0,7%', limite: t('máximo 0,5'), estado: 'critico', origem: 'científico', equipamento: 'WATSON' },
    ],
    resposta: t(
      'Não autorizar EVA com temperatura abaixo de −40 °C. Filtrar todo ar de entrada e descontaminar trajes antes de entrar no habitat.',
    ),
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
    rotulo: t('Nominal'),
  },
  atencao: {
    texto: 'text-alerta',
    bg: 'bg-alerta/10',
    borda: 'border-alerta/35',
    rotulo: t('Atenção'),
  },
  critico: {
    texto: 'text-critico',
    bg: 'bg-critico/10',
    borda: 'border-critico/45',
    rotulo: t('Crítico'),
  },
}
