/**
 * Checklist de atividade extraveicular (EVA).
 *
 * AVISO: itens ILUSTRATIVOS, baseados em princípios gerais de operação de
 * traje e procedimento de saída. Não constituem checklist operacional
 * validado. A interface deixa isso explícito.
 */

import { t } from './i18n'

export type FaseEva = 'pre' | 'durante' | 'pos'

export type ItemEva = {
  id: string
  texto: string
  detalhe?: string
  /** Item bloqueante: sem ele, a saída não deve ser autorizada. */
  critico: boolean
}

export type GrupoEva = {
  fase: FaseEva
  titulo: string
  descricao: string
  itens: ItemEva[]
}

export const GRUPOS_EVA: GrupoEva[] = [
  {
    fase: 'pre',
    titulo: t('Antes da saída'),
    descricao: t('Verificações que precisam estar completas para autorizar a EVA.'),
    itens: [
      {
        id: 'pre-1',
        texto: t('Traje pressurizado e integridade verificada'),
        detalhe: t('Checar vedação, pressão e tempo de autonomia.'),
        critico: true,
      },
      {
        id: 'pre-2',
        texto: t('Reserva de oxigênio suficiente para ida, atividade e retorno'),
        detalhe: t('Considerar 30% de margem para imprevisto.'),
        critico: true,
      },
      {
        id: 'pre-3',
        texto: t('Temperatura externa dentro do limite operacional'),
        detalhe: t('Abaixo de −40 °C a saída não é autorizada.'),
        critico: true,
      },
      {
        id: 'pre-4',
        texto: t('Radiação acumulada dentro do limite da missão'),
        detalhe: t('Conferir dose restante antes de somar nova exposição.'),
        critico: true,
      },
      {
        id: 'pre-5',
        texto: t('Comunicação testada com o habitat e relay'),
        detalhe: t('Confirmar enlace de rádio e canal de emergência.'),
        critico: true,
      },
      {
        id: 'pre-6',
        texto: t('Rota revisada e zonas de risco identificadas'),
        detalhe: t('Conferir inclinação e obstáculos no planejador.'),
        critico: false,
      },
      {
        id: 'pre-7',
        texto: t('Kit de emergência e ferramentas conferidos'),
        critico: false,
      },
      {
        id: 'pre-8',
        texto: t('Tripulação de apoio avisada e posicionada'),
        detalhe: t('Alguém acompanha a EVA de dentro do habitat.'),
        critico: false,
      },
    ],
  },
  {
    fase: 'durante',
    titulo: t('Durante a atividade'),
    descricao: t('Monitoramento contínuo enquanto a equipe está fora.'),
    itens: [
      { id: 'dur-1', texto: t('Check-in de rádio a cada 15 minutos'), critico: true },
      { id: 'dur-2', texto: t('Consumo de oxigênio dentro do previsto'), critico: true },
      {
        id: 'dur-3',
        texto: t('Condições ambientais ainda dentro do limite'),
        detalhe: t('Suspender a EVA se τ ou temperatura saírem da faixa.'),
        critico: true,
      },
      { id: 'dur-4', texto: t('Posição da equipe rastreada e dentro da rota'), critico: false },
      { id: 'dur-5', texto: t('Amostras e registros coletados conforme o plano'), critico: false },
    ],
  },
  {
    fase: 'pos',
    titulo: t('Depois do retorno'),
    descricao: t('Encerramento, descontaminação e registro.'),
    itens: [
      {
        id: 'pos-1',
        texto: t('Descontaminação do traje antes de entrar no habitat'),
        detalhe: t('Poeira com percloratos não pode entrar no volume pressurizado.'),
        critico: true,
      },
      { id: 'pos-2', texto: t('Estado de saúde da tripulação avaliado'), critico: true },
      {
        id: 'pos-3',
        texto: t('Dose de radiação acumulada registrada'),
        critico: true,
      },
      { id: 'pos-4', texto: t('Amostras armazenadas corretamente'), critico: false },
      { id: 'pos-5', texto: t('Relatório de EVA redigido e arquivado'), critico: false },
    ],
  },
]

export const TODOS_ITENS = GRUPOS_EVA.flatMap((g) => g.itens)
export const CRITICOS = TODOS_ITENS.filter((i) => i.critico).length
