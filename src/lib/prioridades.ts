/**
 * Prioridades de sobrevivência, ordenadas por LETALIDADE — quanto tempo a
 * tripulação tem até sofrer dano permanente.
 *
 * Ordem baseada em fisiologia humana e nas cinco categorias RIDGE da NASA:
 * o que mata em segundos vem antes do que mata em anos.
 *
 * Fontes: NASA "Humans to Mars", Human Research Program, RAD/Curiosity,
 * Phoenix (percloratos).
 */

export type Janela = 'segundos' | 'minutos' | 'horas' | 'dias' | 'semanas' | 'meses' | 'anos'

export type Prioridade = {
  ordem: number
  id: string
  nome: string
  janela: Janela
  /** Quanto tempo a pessoa tem até dano irreversível. */
  tempoCritico: string
  /** O que exatamente acontece. */
  efeito: string
  /** O que o sistema deve verificar. */
  verificacao: string
  ridge: string
  protocolo?: string
}

export const PRIORIDADES: Prioridade[] = [
  {
    ordem: 1,
    id: 'pressao',
    nome: 'Pressão e integridade do traje',
    janela: 'segundos',
    tempoCritico: '~15 segundos até perda de consciência',
    efeito:
      'A pressão marciana é ~0,6 kPa. Sem traje pressurizado, os fluidos corporais fervem e a ebulição começa em segundos. Não é falta de ar: é descompressão explosiva.',
    verificacao: 'Integridade do traje, vedação, pressão interna antes de cada saída',
    ridge: 'E',
    protocolo: 'ENV-001',
  },
  {
    ordem: 2,
    id: 'oxigenio',
    nome: 'Oxigênio respirável',
    janela: 'minutos',
    tempoCritico: '~2 minutos sem O₂; 3–5 min até dano cerebral',
    efeito:
      'A atmosfera é 96% CO₂. Sem suplementação, a hipóxia leva à perda de consciência antes de qualquer sintoma — o tripulante desmaia sem perceber.',
    verificacao: 'Concentração de O₂ no habitat e autonomia do sistema',
    ridge: 'E',
    protocolo: 'LSS-001',
  },
  {
    ordem: 3,
    id: 'temperatura',
    nome: 'Temperatura',
    janela: 'minutos',
    tempoCritico: '~5 minutos até hipotermia severa em −62 °C',
    efeito:
      'Varia de −153 °C a +20 °C. O congelamento começa nas extremidades e avança rápido. O choque térmico também degrada equipamentos e vedações.',
    verificacao: 'Temperatura externa antes e durante a EVA',
    ridge: 'E',
    protocolo: 'ENV-002',
  },
  {
    ordem: 4,
    id: 'poeira',
    nome: 'Poeira e visibilidade',
    janela: 'horas',
    tempoCritico: 'Tempestades duram horas a meses',
    efeito:
      'A poeira suspensa cega sensores, cobre painéis solares e derruba a geração de energia. Em τ acima de 1,5 a equipe pode se perder a poucos metros do habitat.',
    verificacao: 'Opacidade τ, geração de energia, reserva de baterias',
    ridge: 'E',
    protocolo: 'ENV-002',
  },
  {
    ordem: 5,
    id: 'percloratos',
    nome: 'Percloratos no solo',
    janela: 'dias',
    tempoCritico: 'Contaminação acumulativa em dias de exposição',
    efeito:
      'O solo tem 0,5–1% de perclorato, tóxico para a tireoide e para os pulmões. A poeira contaminada não pode entrar no volume pressurizado, ou contamina a tripulação e o sistema de ar.',
    verificacao: 'Descontaminação de trajes, filtragem de ar de entrada',
    ridge: 'E',
    protocolo: 'ENV-001',
  },
  {
    ordem: 6,
    id: 'comunicacao',
    nome: 'Comunicação e autonomia',
    janela: 'horas',
    tempoCritico: 'Atraso de 4 a 24 minutos; conjunção solar corta o enlace por semanas',
    efeito:
      'Não existe ajuda em tempo real. Em emergência, a tripulação decide sozinha. Depender de autorização da Terra é o mesmo que não ter resposta.',
    verificacao: 'Estado do enlace, próxima janela de relay, protocolos autônomos',
    ridge: 'D',
    protocolo: 'COM-001',
  },
  {
    ordem: 7,
    id: 'radiacao',
    nome: 'Radiação acumulada',
    janela: 'meses',
    tempoCritico: 'Acumula ao longo de toda a missão; limite de carreira 1 Sv',
    efeito:
      'Dano ao DNA, câncer e perda de função renal. Não há sintoma imediato: o dano aparece anos depois, e não é reversível.',
    verificacao: 'Dose diária, dose acumulada, blindagem do abrigo',
    ridge: 'R',
    protocolo: 'ENV-001',
  },
  {
    ordem: 8,
    id: 'psicologico',
    nome: 'Saúde psicológica',
    janela: 'semanas',
    tempoCritico: 'Deteriora em semanas de confinamento',
    efeito:
      'Sono ruim, conflito e isolamento degradam a cognição antes de qualquer sintoma físico. A decisão mais crítica é tomada justamente por quem está exausto.',
    verificacao: 'Sono, carga de trabalho, avaliação do médico de voo',
    ridge: 'I',
    protocolo: 'MED-001',
  },
  {
    ordem: 9,
    id: 'gravidade',
    nome: 'Gravidade e massa óssea',
    janela: 'anos',
    tempoCritico: 'Adaptação ao longo de meses; perda óssea parcialmente irreversível',
    efeito:
      '0,38 g causa perda de massa óssea e atrofia muscular. Modelos indicam risco de osteoporose em missões longas. Aumenta o risco de fratura em EVA.',
    verificacao: 'Adesão ao exercício, densidade óssea a cada 30 sóis',
    ridge: 'G',
    protocolo: 'MED-002',
  },
]

/** Cor da janela de letalidade — do mais urgente ao mais lento. */
export const CORES_JANELA: Record<Janela, string> = {
  segundos: 'text-critico',
  minutos: 'text-critico',
  horas: 'text-alerta',
  dias: 'text-alerta',
  semanas: 'text-alerta/80',
  meses: 'text-gelo/55',
  anos: 'text-gelo/65',
}
