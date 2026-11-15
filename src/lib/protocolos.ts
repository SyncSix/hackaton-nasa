/**
 * Protocolos de sobrevivência.
 *
 * AVISO: os procedimentos abaixo são ILUSTRATIVOS, elaborados para
 * demonstrar a experiência do protótipo. Não são protocolos operacionais
 * validados e não devem ser usados em missão real.
 */

import { t } from './i18n'

export type Criticidade = 'alta' | 'media' | 'baixa'

export type Protocolo = {
  id: string
  titulo: string
  categoria: string
  sistema: string
  criticidade: Criticidade
  /** Categoria RIDGE associada. */
  ridge: string
  identificacao: string[]
  avaliacao: string[]
  procedimento: string[]
  recursos: string[]
  /** Quando a situação pode ser considerada controlada. */
  criterioResolucao: string[]
  /** Referência técnica de origem. */
  referencia: string
}

export const PROTOCOLOS: Protocolo[] = [
  {
    id: 'ENV-001',
    titulo: t('Despressurização do habitat'),
    categoria: t('Ambientes hostis'),
    sistema: t('Estrutura e suporte à vida'),
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      t('Queda na pressão interna maior que 0,5 kPa/min'),
      t('Alarme de integridade estrutural acionado'),
      t('Ruído de escape de ar audível em qualquer módulo'),
    ],
    avaliacao: [
      t('Identificar quais compartimentos perderam pressão pelo painel de módulos'),
      t('Confirmar leitura com o sensor redundante do módulo'),
      t('Verificar se a tripulação está em área pressurizada'),
    ],
    procedimento: [
      t('Fechar as comportas do módulo afetado'),
      t('Reunir a tripulação no módulo de segurança'),
      t('Colocar trajes pressurizados se a pressão continuar caindo'),
      t('Isolar o módulo e reportar à Terra assim que houver janela'),
      t('Nunca abrir a comporta do módulo isolado antes de estabilizar a pressão'),
    ],
    recursos: [
      t('Sistema de suporte à vida redundante'),
      t('Trajes pressurizados'),
      t('Kit de vedação de emergência'),
      t('Sensores de pressão redundantes'),
    ],
    criterioResolucao: [
      t('Pressão estável por 30 minutos'),
      t('Módulo isolado sem perda adicional'),
      t('Fonte do vazamento identificada'),
    ],
    referencia: t('NASA Human Research Program · Hostile Environments'),
  },
  {
    id: 'ENV-002',
    titulo: t('Tempestade de poeira severa'),
    categoria: t('Ambientes hostis'),
    sistema: t('Energia e proteção externa'),
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      t('Opacidade de poeira (τ) acima de 1,5'),
      t('Queda na geração solar acima de 40%'),
      t('Redução de visibilidade externa'),
    ],
    avaliacao: [
      t('Consultar leitura de τ e comparar com o histórico'),
      t('Verificar carga das baterias e reserva de energia'),
      t('Confirmar posição da tripulação dentro do habitat'),
    ],
    procedimento: [
      t('Suspender toda EVA imediatamente'),
      t('Proteger entradas de ar dos filtros de poeira'),
      t('Priorizar energia para suporte à vida e aquecimento'),
      t('Ativar modo de economia nos sistemas não essenciais'),
      t('Limpar painéis solares apenas quando a tempestade cessar'),
    ],
    recursos: [
      t('Fonte de energia nuclear (fissão de superfície)'),
      t('Baterias de reserva'),
      t('Filtros de ar substitutos'),
    ],
    criterioResolucao: [
      t('τ abaixo de 1,0 por 6 horas'),
      t('Geração de energia estabilizada'),
      t('Filtros de ar desobstruídos'),
    ],
    referencia: t('NASA · Mars Dust Storms Observados por MEDA'),
  },
  {
    id: 'LSS-001',
    titulo: t('Falha no fornecimento de oxigênio'),
    categoria: t('Ambientes hostis'),
    sistema: t('Suporte à vida'),
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      t('Concentração de O₂ abaixo de 16%'),
      t('Alarme do gerador de oxigênio'),
      t('Queda na pressão parcial de oxigênio'),
    ],
    avaliacao: [
      t('Verificar concentração de O₂ em todos os módulos'),
      t('Identificar qual gerador falhou (primário ou redundante)'),
      t('Estimar tempo de autonomia com a reserva atual'),
    ],
    procedimento: [
      t('Ativar gerador redundante'),
      t('Distribuir máscaras de emergência se a concentração continuar caindo'),
      t('Evitar esforço físico até restaurar a produção'),
      t('Se a falha for irreparável, preparar evacuação para o módulo de reserva'),
    ],
    recursos: [
      t('Reserva de oxigênio gasoso'),
      t('Máscaras de emergência'),
      t('Gerador redundante (MOXIE)'),
    ],
    criterioResolucao: [
      t('O₂ acima de 19,5%'),
      t('Gerador primário restaurado ou redundante estável'),
      t('Autonomia acima de 72 horas'),
    ],
    referencia: t('NASA · MOXIE / Life Support Systems'),
  },
  {
    id: 'PWR-001',
    titulo: t('Falha energética do habitat'),
    categoria: t('Ambientes hostis'),
    sistema: t('Energia'),
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      t('Queda de tensão no barramento principal'),
      t('Desligamento em cascata de sistemas'),
      t('Temperatura interna em queda'),
    ],
    avaliacao: [
      t('Verificar carga das baterias'),
      t('Identificar quais sistemas ainda estão operando'),
      t('Calcular tempo até falha do suporte à vida'),
    ],
    procedimento: [
      t('Desligar sistemas não essenciais imediatamente'),
      t('Priorizar: suporte à vida, aquecimento, comunicação'),
      t('Isolar o consumidor com falha'),
      t('Acionar fonte auxiliar de energia'),
    ],
    recursos: [
      t('Baterias de reserva'),
      t('Gerador auxiliar'),
      t('Lista de prioridade energética'),
    ],
    criterioResolucao: [
      t('Barramento principal estável'),
      t('Suporte à vida e aquecimento operacionais'),
      t('Reserva acima de 30%'),
    ],
    referencia: t('NASA · Power Systems for Surface Missions'),
  },
  {
    id: 'COM-001',
    titulo: t('Perda de comunicação com a Terra'),
    categoria: t('Distância da Terra'),
    sistema: t('Comunicação'),
    criticidade: 'media',
    ridge: 'D',
    identificacao: [
      t('Sem resposta após 2 janelas de relay consecutivas'),
      t('Falha no rastreamento da antena'),
      t('Atraso de sinal acima do esperado para a época'),
    ],
    avaliacao: [
      t('Confirmar se é falha local ou interrupção do enlace'),
      t('Verificar alinhamento da antena'),
      t('Checar se há conjunção solar prevista'),
    ],
    procedimento: [
      t('Manter operação normal; a perda de comunicação não é emergência isolada'),
      t('Tentar relay por rovers e orbitadores'),
      t('Registrar todas as decisões tomadas sem orientação da Terra'),
      t('Não alterar o plano de missão por falta de comunicação'),
    ],
    recursos: [
      t('Antena de alto ganho'),
      t('Relays orbitais (Odyssey, MRO)'),
      t('Registro de decisões autônomas'),
    ],
    criterioResolucao: [
      t('Enlace de dados restabelecido'),
      t('Confirmação de recebimento pela Terra'),
    ],
    referencia: t('NASA · Mars Relay Network'),
  },
  {
    id: 'MED-001',
    titulo: t('Crise de saúde psicológica'),
    categoria: t('Isolamento e confinamento'),
    sistema: t('Saúde da tripulação'),
    criticidade: 'media',
    ridge: 'I',
    identificacao: [
      t('Alteração de sono por mais de 3 sóis consecutivos'),
      t('Isolamento voluntário prolongado'),
      t('Conflito interpessoal recorrente'),
      t('Dificuldade de concentração em tarefas críticas'),
    ],
    avaliacao: [
      t('Conversa individual com o médico de voo'),
      t('Revisão da carga de trabalho e escala'),
      t('Verificação de sono e alimentação'),
    ],
    procedimento: [
      t('Reduzir carga de trabalho do tripulante afetado'),
      t('Garantir período de descanso protegido'),
      t('Agendar comunicação com a família na próxima janela'),
      t('Transferir tarefas críticas para outro tripulante'),
    ],
    recursos: [
      t('Médico de voo'),
      t('Protocolos de suporte psicológico'),
      t('Janela de comunicação prioritária'),
    ],
    criterioResolucao: [
      t('Sono restabelecido por 3 sóis'),
      t('Retorno gradual às tarefas'),
      t('Avaliação positiva do médico de voo'),
    ],
    referencia: t('NASA Human Research Program · Isolation and Confinement'),
  },
]

export const CORES_CRITICIDADE: Record<Criticidade, string> = {
  alta: 'text-critico border-critico/40 bg-critico/10',
  media: 'text-alerta border-alerta/40 bg-alerta/10',
  baixa: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
}
