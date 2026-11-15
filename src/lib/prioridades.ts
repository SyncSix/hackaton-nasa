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

import { t } from './i18n'

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
    nome: t('Pressão e integridade do traje'),
    janela: 'segundos',
    tempoCritico: t('~15 segundos até perda de consciência'),
    efeito: t(
      'A pressão marciana é ~0,6 kPa. Sem traje pressurizado, os fluidos corporais fervem e a ebulição começa em segundos. Não é falta de ar: é descompressão explosiva.',
    ),
    verificacao: t('Integridade do traje, vedação, pressão interna antes de cada saída'),
    ridge: 'E',
    protocolo: 'ENV-001',
  },
  {
    ordem: 2,
    id: 'oxigenio',
    nome: t('Oxigênio respirável'),
    janela: 'minutos',
    tempoCritico: t('~2 minutos sem O₂; 3–5 min até dano cerebral'),
    efeito: t(
      'A atmosfera é 96% CO₂. Sem suplementação, a hipóxia leva à perda de consciência antes de qualquer sintoma — o tripulante desmaia sem perceber.',
    ),
    verificacao: t('Concentração de O₂ no habitat e autonomia do sistema'),
    ridge: 'E',
    protocolo: 'LSS-001',
  },
  {
    ordem: 3,
    id: 'temperatura',
    nome: t('Temperatura'),
    janela: 'minutos',
    tempoCritico: t('~5 minutos até hipotermia severa em −62 °C'),
    efeito: t(
      'Varia de −153 °C a +20 °C. O congelamento começa nas extremidades e avança rápido. O choque térmico também degrada equipamentos e vedações.',
    ),
    verificacao: t('Temperatura externa antes e durante a EVA'),
    ridge: 'E',
    protocolo: 'ENV-002',
  },
  {
    ordem: 4,
    id: 'poeira',
    nome: t('Poeira e visibilidade'),
    janela: 'horas',
    tempoCritico: t('Tempestades duram horas a meses'),
    efeito: t(
      'A poeira suspensa cega sensores, cobre painéis solares e derruba a geração de energia. Em τ acima de 1,5 a equipe pode se perder a poucos metros do habitat.',
    ),
    verificacao: t('Opacidade τ, geração de energia, reserva de baterias'),
    ridge: 'E',
    protocolo: 'ENV-002',
  },
  {
    ordem: 5,
    id: 'percloratos',
    nome: t('Percloratos no solo'),
    janela: 'dias',
    tempoCritico: t('Contaminação acumulativa em dias de exposição'),
    efeito: t(
      'O solo tem 0,5–1% de perclorato, tóxico para a tireoide e para os pulmões. A poeira contaminada não pode entrar no volume pressurizado, ou contamina a tripulação e o sistema de ar.',
    ),
    verificacao: t('Descontaminação de trajes, filtragem de ar de entrada'),
    ridge: 'E',
    protocolo: 'ENV-001',
  },
  {
    ordem: 6,
    id: 'comunicacao',
    nome: t('Comunicação e autonomia'),
    janela: 'horas',
    tempoCritico: t('Atraso de 4 a 24 minutos; conjunção solar corta o enlace por semanas'),
    efeito: t(
      'Não existe ajuda em tempo real. Em emergência, a tripulação decide sozinha. Depender de autorização da Terra é o mesmo que não ter resposta.',
    ),
    verificacao: t('Estado do enlace, próxima janela de relay, protocolos autônomos'),
    ridge: 'D',
    protocolo: 'COM-001',
  },
  {
    ordem: 7,
    id: 'radiacao',
    nome: t('Radiação acumulada'),
    janela: 'meses',
    tempoCritico: t('Acumula ao longo de toda a missão; limite de carreira 1 Sv'),
    efeito: t(
      'Dano ao DNA, câncer e perda de função renal. Não há sintoma imediato: o dano aparece anos depois, e não é reversível.',
    ),
    verificacao: t('Dose diária, dose acumulada, blindagem do abrigo'),
    ridge: 'R',
    protocolo: 'ENV-001',
  },
  {
    ordem: 8,
    id: 'psicologico',
    nome: t('Saúde psicológica'),
    janela: 'semanas',
    tempoCritico: t('Deteriora em semanas de confinamento'),
    efeito: t(
      'Sono ruim, conflito e isolamento degradam a cognição antes de qualquer sintoma físico. A decisão mais crítica é tomada justamente por quem está exausto.',
    ),
    verificacao: t('Sono, carga de trabalho, avaliação do médico de voo'),
    ridge: 'I',
    protocolo: 'MED-001',
  },
  {
    ordem: 9,
    id: 'gravidade',
    nome: t('Gravidade e massa óssea'),
    janela: 'anos',
    tempoCritico: t('Adaptação ao longo de meses; perda óssea parcialmente irreversível'),
    efeito: t(
      '0,38 g causa perda de massa óssea e atrofia muscular. Modelos indicam risco de osteoporose em missões longas. Aumenta o risco de fratura em EVA.',
    ),
    verificacao: t('Adesão ao exercício, densidade óssea a cada 30 sóis'),
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
