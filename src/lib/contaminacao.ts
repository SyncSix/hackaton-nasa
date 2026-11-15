/**
 * Proteção planetária e controle de contaminação.
 *
 * Dois sentidos:
 *  - Forward: microrganismos terrestres contaminando Marte.
 *  - Backward: material marciano contaminando a Terra ou o habitat.
 *
 * O solo marciano tem 0,5–1% de percloratos (Phoenix). A poeira fina adere
 * a trajes e juntas; se entrar no volume pressurizado, contamina a tripulação
 * e o sistema de ar.
 *
 * Valores SIMULADOS. Limites e lógica seguem COSPAR/NASA planetary protection.
 */

export type ZonaContaminacao = {
  id: string
  nome: string
  descricao: string
  /** Nível de contaminação atual, 0–100. */
  nivel: number
  /** Limite aceitável. */
  limite: number
  /** O que precisa ser feito. */
  acao: string
  /** Equipamento que mede ou controla. */
  equipamento: string
}

export const ZONAS: ZonaContaminacao[] = [
  {
    id: 'airlock',
    nome: 'Eclusa de entrada',
    descricao:
      'Primeira barreira. Toda poeira que passa daqui entra no volume pressurizado do habitat.',
    nivel: 34,
    limite: 25,
    acao: 'Ciclo de sopro e aspiração antes de abrir a comporta interna.',
    equipamento: 'Eclusa · filtro HEPA',
  },
  {
    id: 'traje',
    nome: 'Superfície do traje',
    descricao:
      'A poeira adere às juntas e vedações. Acumula a cada EVA e degrada a vedação com o tempo.',
    nivel: 62,
    limite: 40,
    acao: 'Escovação a seco e inspeção de vedações após cada saída.',
    equipamento: 'WATSON · inspeção visual',
  },
  {
    id: 'amostras',
    nome: 'Amostras seladas',
    descricao:
      'Material marciano não pode ser aberto dentro do habitat sem contenção. Risco nos dois sentidos.',
    nivel: 12,
    limite: 20,
    acao: 'Manter seladas em contêiner duplo até o laboratório.',
    equipamento: 'Contêiner de amostra',
  },
  {
    id: 'ar',
    nome: 'Ar do habitat',
    descricao:
      'Partículas suspensas com perclorato circulam pelo sistema de ventilação.',
    nivel: 18,
    limite: 25,
    acao: 'Filtragem contínua e troca de filtros conforme saturação.',
    equipamento: 'HEPA · ARF',
  },
]

export type EstadoContaminacao = 'nominal' | 'atencao' | 'critico'

export function avaliarZona(z: ZonaContaminacao): EstadoContaminacao {
  if (z.nivel > z.limite * 1.4) return 'critico'
  if (z.nivel > z.limite) return 'atencao'
  return 'nominal'
}

/** Nível global: o pior caso define o estado do sistema. */
export function estadoGlobal(): EstadoContaminacao {
  const estados = ZONAS.map(avaliarZona)
  if (estados.includes('critico')) return 'critico'
  if (estados.includes('atencao')) return 'atencao'
  return 'nominal'
}

/**
 * Ciclos de EVA antes de a vedação do traje exigir manutenção.
 * A poeira degrada a vedação de forma acumulativa.
 */
export const CICLOS_TRAJE = {
  usados: 14,
  limite: 20,
  nota: 'Após 20 ciclos, a vedação precisa de inspeção e possível troca.',
}
