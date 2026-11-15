/**
 * Registro de decisões autônomas.
 *
 * Com atraso de 4 a 24 minutos e janelas de relay intermitentes, a tripulação
 * decide sozinha. Uma auditoria de missão exige que cada decisão tomada sem
 * orientação da Terra tenha registro: o que se sabia, o que se decidiu e por quê.
 *
 * A lista abaixo é SIMULADA, para demonstrar o fluxo.
 */

import { t } from './i18n'

export type DecisaoAutonoma = {
  id: string
  sol: number
  hora: string
  categoria: 'emergência' | 'EVA' | 'recurso' | 'rota' | 'médico'
  titulo: string
  /** Situação observada no momento. */
  contexto: string
  /** O que foi decidido. */
  decisao: string
  /** Justificativa registrada. */
  justificativa: string
  /** Estado do enlace quando foi tomada. */
  enlace: 'sem contato' | 'aguardando' | 'ativo'
  /** Minutos de atraso esperados. */
  latenciaMin: number
  /** Protocolo seguido, se houver. */
  protocolo?: string
  /** Se a Terra foi informada depois. */
  reportado: boolean
}

export const DECISOES: DecisaoAutonoma[] = [
  {
    id: 'D-0142',
    sol: 1742,
    hora: '14:18',
    categoria: 'EVA',
    titulo: t('Suspender EVA por aumento de opacidade'),
    contexto: t(
      'Opacidade subiu de 0,84 para 1,7 em duas horas com a equipe a 2,3 km do habitat.',
    ),
    decisao: t('EVA suspensa e equipe chamada de volta ao habitat.'),
    justificativa:
      t(
        'τ acima de 1,5 reduz a visibilidade abaixo de 50 m. O retorno fica mais difícil a cada minuto.',
      ),
    enlace: 'sem contato',
    latenciaMin: 14,
    protocolo: 'ENV-002',
    reportado: true,
  },
  {
    id: 'D-0141',
    sol: 1740,
    hora: '08:52',
    categoria: 'médico',
    titulo: t('Iniciar protocolo médico autônomo'),
    contexto: t('Tripulante com dor abdominal forte, sem enlace com a Terra há 3 janelas.'),
    decisao: t('Aplicado protocolo médico de apoio e registrado o quadro.'),
    justificativa:
      t(
        'Esperar orientação da Terra, com 22 minutos de atraso e enlace instável, inviabiliza o tratamento.',
      ),
    enlace: 'aguardando',
    latenciaMin: 22,
    protocolo: 'MED-001',
    reportado: true,
  },
  {
    id: 'D-0140',
    sol: 1738,
    hora: '19:34',
    categoria: 'recurso',
    titulo: t('Racionar energia para suporte à vida'),
    contexto: t('Geração solar caiu 40% com τ em 1,2. Reserva de bateria em 62%.'),
    decisao: t('Desligados sistemas não essenciais; priorizados suporte à vida e aquecimento.'),
    justificativa:
      t(
        'Tempestade prolongada pode levar dias. Reduzir consumo agora evita desligamento forçado depois.',
      ),
    enlace: 'ativo',
    latenciaMin: 12,
    protocolo: 'PWR-001',
    reportado: false,
  },
  {
    id: 'D-0139',
    sol: 1736,
    hora: '11:07',
    categoria: 'rota',
    titulo: t('Desviar da encosta pela alternativa sul'),
    contexto: t('Inclinação de 24° no trecho entre W3 e W4, acima da faixa segura.'),
    decisao: t('Rota ajustada: +1,4 km e +22 min, inclinação máxima de 14°.'),
    justificativa:
      t(
        'Encosta acima de 20° exige avaliação por imagem que não existia no momento. O desvio programado cobre a incerteza.',
      ),
    enlace: 'sem contato',
    latenciaMin: 16,
    reportado: true,
  },
  {
    id: 'D-0138',
    sol: 1735,
    hora: '03:41',
    categoria: 'emergência',
    titulo: t('Isolar módulo B após alarme de integridade'),
    contexto: t('Queda de 0,8 kPa/min no módulo B, sem tripulantes presentes.'),
    decisao: t('Comporta fechada e vazamento isolado.'),
    justificativa: t('Sem pessoas em risco no módulo, a prioridade é conter a perda.'),
    enlace: 'aguardando',
    latenciaMin: 18,
    protocolo: 'ENV-001',
    reportado: true,
  },
]

export const CORES_CATEGORIA: Record<DecisaoAutonoma['categoria'], string> = {
  emergência: 'text-critico border-critico/40 bg-critico/10',
  EVA: 'text-alerta border-alerta/40 bg-alerta/10',
  recurso: 'text-marte border-marte/40 bg-marte/10',
  rota: 'text-gelo/70 border-white/15 bg-white/5',
  médico: 'text-nominal border-nominal/40 bg-nominal/10',
}
