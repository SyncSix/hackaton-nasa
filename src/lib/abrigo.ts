/**
 * Abrigo contra partículas solares (SPE — Solar Particle Event).
 *
 * Em um evento solar, a radiação na superfície pode dobrar em horas. A
 * tripulação precisa de um abrigo com blindagem de regolito e um tempo de
 * evacuação definido a partir de qualquer ponto da EVA.
 *
 * Valores SIMULADOS. A lógica (tempo de evacuação vs. tempo de alerta) segue
 * o princípio operacional de que a exposição precisa ser evitada ANTES do
 * pico, não durante.
 */

import { t, tt } from './i18n'

export type Abrigo = {
  id: string
  nome: string
  descricao: string
  /** Tempo para chegar ao abrigo a partir da localização atual. */
  tempoEvacuacaoMin: number
  /** Blindagem efetiva. */
  blindagemGcm2: number
  /** Redução da dose que a blindagem proporciona. */
  reducaoDose: number
  capacidade: number
  /** Se está disponível agora. */
  disponivel: boolean
}

export const ABRIGOS: Abrigo[] = [
  {
    id: 'hab',
    nome: t('Habitat principal'),
    descricao: t('Módulo enterrado com cobertura de regolito. Abrigo primário da missão.'),
    tempoEvacuacaoMin: 0,
    blindagemGcm2: 25,
    reducaoDose: 0.85,
    capacidade: 4,
    disponivel: true,
  },
  {
    id: 'rover',
    nome: t('Rover pressurizado'),
    descricao: t('Abrigo móvel. Cobre a tripulação durante deslocamentos longos.'),
    tempoEvacuacaoMin: 12,
    blindagemGcm2: 8,
    reducaoDose: 0.45,
    capacidade: 4,
    disponivel: true,
  },
  {
    id: 'cache',
    nome: t('Cache de emergência'),
    descricao:
      t(
        'Depósito de suprimentos com parede de regolito, posicionado na rota longa. Abrigo secundário.',
      ),
    tempoEvacuacaoMin: 8,
    blindagemGcm2: 15,
    reducaoDose: 0.65,
    capacidade: 2,
    disponivel: true,
  },
]

export type NivelSpe = 'quieto' | 'alerta' | 'evento'

export type EstadoSolar = {
  nivel: NivelSpe
  /** Dose de superfície atual em mSv/sol. */
  doseAtual: number
  /** Dose durante um pico de evento. */
  dosePico: number
  /** Tempo estimado até o pico do evento, em minutos. */
  tempoAtePicoMin: number
  /** Atividade solar que originou o estado. */
  origem: string
}

export const ESTADO_SOLAR: EstadoSolar = {
  nivel: 'alerta',
  doseAtual: 0.67,
  dosePico: 2.4,
  tempoAtePicoMin: 45,
  origem: t('Região ativa 3842 · flare classe M2'),
}

export const CORES_SPE = {
  quieto: {
    texto: 'text-nominal',
    bg: 'bg-nominal/10',
    borda: 'border-nominal/40',
    rotulo: t('Sem evento'),
    acao: t('Exposição normal. Monitorar.'),
  },
  alerta: {
    texto: 'text-alerta',
    bg: 'bg-alerta/10',
    borda: 'border-alerta/40',
    rotulo: t('Alerta solar'),
    acao: t('Suspender saídas longas. Manter abrigo a menos de 15 min.'),
  },
  evento: {
    texto: 'text-critico',
    bg: 'bg-critico/10',
    borda: 'border-critico/45',
    rotulo: t('Evento em curso'),
    acao: t('Entrar no abrigo imediatamente. Nenhuma EVA autorizada.'),
  },
} as const

/**
 * Veredito de abrigo: a tripulação consegue alcançar proteção antes do pico?
 */
export function vereditoAbrigo(estado: EstadoSolar, abrigo: Abrigo): {
  ok: boolean
  mensagem: string
} {
  if (estado.nivel === 'quieto') {
    return { ok: true, mensagem: t('Sem evento solar. Nenhuma restrição de abrigo.') }
  }

  if (estado.nivel === 'evento') {
    return abrigo.tempoEvacuacaoMin === 0
      ? { ok: true, mensagem: t('No habitat. Permaneça no interior até o fim do evento.') }
      : {
          ok: false,
          mensagem: tt(
            'Evento em curso e você está a {min} min do abrigo. Evacuar imediatamente.',
            { min: abrigo.tempoEvacuacaoMin },
          ),
        }
  }

  const margem = estado.tempoAtePicoMin - abrigo.tempoEvacuacaoMin
  return margem > 15
    ? {
        ok: true,
        mensagem: tt(
          'Chegada ao abrigo em {chegada} min, com {margem} min de margem antes do pico.',
          { chegada: abrigo.tempoEvacuacaoMin, margem },
        ),
      }
    : {
        ok: false,
        mensagem: tt('Margem insuficiente: {margem} min. Reduza a distância do abrigo.', {
          margem,
        }),
      }
}
