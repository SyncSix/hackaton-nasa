/**
 * Checklist de atividade extraveicular (EVA).
 *
 * AVISO: itens ILUSTRATIVOS, baseados em princípios gerais de operação de
 * traje e procedimento de saída. Não constituem checklist operacional
 * validado. A interface deixa isso explícito.
 */

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
    titulo: 'Antes da saída',
    descricao: 'Verificações que precisam estar completas para autorizar a EVA.',
    itens: [
      {
        id: 'pre-1',
        texto: 'Traje pressurizado e integridade verificada',
        detalhe: 'Checar vedação, pressão e tempo de autonomia.',
        critico: true,
      },
      {
        id: 'pre-2',
        texto: 'Reserva de oxigênio suficiente para ida, atividade e retorno',
        detalhe: 'Considerar 30% de margem para imprevisto.',
        critico: true,
      },
      {
        id: 'pre-3',
        texto: 'Temperatura externa dentro do limite operacional',
        detalhe: 'Abaixo de −40 °C a saída não é autorizada.',
        critico: true,
      },
      {
        id: 'pre-4',
        texto: 'Radiação acumulada dentro do limite da missão',
        detalhe: 'Conferir dose restante antes de somar nova exposição.',
        critico: true,
      },
      {
        id: 'pre-5',
        texto: 'Comunicação testada com o habitat e relay',
        detalhe: 'Confirmar enlace de rádio e canal de emergência.',
        critico: true,
      },
      {
        id: 'pre-6',
        texto: 'Rota revisada e zonas de risco identificadas',
        detalhe: 'Conferir inclinação e obstáculos no planejador.',
        critico: false,
      },
      {
        id: 'pre-7',
        texto: 'Kit de emergência e ferramentas conferidos',
        critico: false,
      },
      {
        id: 'pre-8',
        texto: 'Tripulação de apoio avisada e posicionada',
        detalhe: 'Alguém acompanha a EVA de dentro do habitat.',
        critico: false,
      },
    ],
  },
  {
    fase: 'durante',
    titulo: 'Durante a atividade',
    descricao: 'Monitoramento contínuo enquanto a equipe está fora.',
    itens: [
      { id: 'dur-1', texto: 'Check-in de rádio a cada 15 minutos', critico: true },
      { id: 'dur-2', texto: 'Consumo de oxigênio dentro do previsto', critico: true },
      {
        id: 'dur-3',
        texto: 'Condições ambientais ainda dentro do limite',
        detalhe: 'Suspender a EVA se τ ou temperatura saírem da faixa.',
        critico: true,
      },
      { id: 'dur-4', texto: 'Posição da equipe rastreada e dentro da rota', critico: false },
      { id: 'dur-5', texto: 'Amostras e registros coletados conforme o plano', critico: false },
    ],
  },
  {
    fase: 'pos',
    titulo: 'Depois do retorno',
    descricao: 'Encerramento, descontaminação e registro.',
    itens: [
      {
        id: 'pos-1',
        texto: 'Descontaminação do traje antes de entrar no habitat',
        detalhe: 'Poeira com percloratos não pode entrar no volume pressurizado.',
        critico: true,
      },
      { id: 'pos-2', texto: 'Estado de saúde da tripulação avaliado', critico: true },
      {
        id: 'pos-3',
        texto: 'Dose de radiação acumulada registrada',
        critico: true,
      },
      { id: 'pos-4', texto: 'Amostras armazenadas corretamente', critico: false },
      { id: 'pos-5', texto: 'Relatório de EVA redigido e arquivado', critico: false },
    ],
  },
]

export const TODOS_ITENS = GRUPOS_EVA.flatMap((g) => g.itens)
export const CRITICOS = TODOS_ITENS.filter((i) => i.critico).length
