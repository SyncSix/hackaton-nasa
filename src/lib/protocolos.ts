/**
 * Protocolos de sobrevivência.
 *
 * AVISO: os procedimentos abaixo são ILUSTRATIVOS, elaborados para
 * demonstrar a experiência do protótipo. Não são protocolos operacionais
 * validados e não devem ser usados em missão real.
 */

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
    titulo: 'Despressurização do habitat',
    categoria: 'Ambientes hostis',
    sistema: 'Estrutura e suporte à vida',
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      'Queda na pressão interna maior que 0,5 kPa/min',
      'Alarme de integridade estrutural acionado',
      'Ruído de escape de ar audível em qualquer módulo',
    ],
    avaliacao: [
      'Identificar quais compartimentos perderam pressão pelo painel de módulos',
      'Confirmar leitura com o sensor redundante do módulo',
      'Verificar se a tripulação está em área pressurizada',
    ],
    procedimento: [
      'Fechar as comportas do módulo afetado',
      'Reunir a tripulação no módulo de segurança',
      'Colocar trajes pressurizados se a pressão continuar caindo',
      'Isolar o módulo e reportar à Terra assim que houver janela',
      'Nunca abrir a comporta do módulo isolado antes de estabilizar a pressão',
    ],
    recursos: [
      'Sistema de suporte à vida redundante',
      'Trajes pressurizados',
      'Kit de vedação de emergência',
      'Sensores de pressão redundantes',
    ],
    criterioResolucao: [
      'Pressão estável por 30 minutos',
      'Módulo isolado sem perda adicional',
      'Fonte do vazamento identificada',
    ],
    referencia: 'NASA Human Research Program · Hostile Environments',
  },
  {
    id: 'ENV-002',
    titulo: 'Tempestade de poeira severa',
    categoria: 'Ambientes hostis',
    sistema: 'Energia e proteção externa',
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      'Opacidade de poeira (τ) acima de 1,5',
      'Queda na geração solar acima de 40%',
      'Redução de visibilidade externa',
    ],
    avaliacao: [
      'Consultar leitura de τ e comparar com o histórico',
      'Verificar carga das baterias e reserva de energia',
      'Confirmar posição da tripulação dentro do habitat',
    ],
    procedimento: [
      'Suspender toda EVA imediatamente',
      'Proteger entradas de ar dos filtros de poeira',
      'Priorizar energia para suporte à vida e aquecimento',
      'Ativar modo de economia nos sistemas não essenciais',
      'Limpar painéis solares apenas quando a tempestade cessar',
    ],
    recursos: [
      'Fonte de energia nuclear (fissão de superfície)',
      'Baterias de reserva',
      'Filtros de ar substitutos',
    ],
    criterioResolucao: [
      'τ abaixo de 1,0 por 6 horas',
      'Geração de energia estabilizada',
      'Filtros de ar desobstruídos',
    ],
    referencia: 'NASA · Mars Dust Storms Observados por MEDA',
  },
  {
    id: 'LSS-001',
    titulo: 'Falha no fornecimento de oxigênio',
    categoria: 'Ambientes hostis',
    sistema: 'Suporte à vida',
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      'Concentração de O₂ abaixo de 16%',
      'Alarme do gerador de oxigênio',
      'Queda na pressão parcial de oxigênio',
    ],
    avaliacao: [
      'Verificar concentração de O₂ em todos os módulos',
      'Identificar qual gerador falhou (primário ou redundante)',
      'Estimar tempo de autonomia com a reserva atual',
    ],
    procedimento: [
      'Ativar gerador redundante',
      'Distribuir máscaras de emergência se a concentração continuar caindo',
      'Evitar esforço físico até restaurar a produção',
      'Se a falha for irreparável, preparar evacuação para o módulo de reserva',
    ],
    recursos: [
      'Reserva de oxigênio gasoso',
      'Máscaras de emergência',
      'Gerador redundante (MOXIE)',
    ],
    criterioResolucao: [
      'O₂ acima de 19,5%',
      'Gerador primário restaurado ou redundante estável',
      'Autonomia acima de 72 horas',
    ],
    referencia: 'NASA · MOXIE / Life Support Systems',
  },
  {
    id: 'PWR-001',
    titulo: 'Falha energética do habitat',
    categoria: 'Ambientes hostis',
    sistema: 'Energia',
    criticidade: 'alta',
    ridge: 'E',
    identificacao: [
      'Queda de tensão no barramento principal',
      'Desligamento em cascata de sistemas',
      'Temperatura interna em queda',
    ],
    avaliacao: [
      'Verificar carga das baterias',
      'Identificar quais sistemas ainda estão operando',
      'Calcular tempo até falha do suporte à vida',
    ],
    procedimento: [
      'Desligar sistemas não essenciais imediatamente',
      'Priorizar: suporte à vida, aquecimento, comunicação',
      'Isolar o consumidor com falha',
      'Acionar fonte auxiliar de energia',
    ],
    recursos: [
      'Baterias de reserva',
      'Gerador auxiliar',
      'Lista de prioridade energética',
    ],
    criterioResolucao: [
      'Barramento principal estável',
      'Suporte à vida e aquecimento operacionais',
      'Reserva acima de 30%',
    ],
    referencia: 'NASA · Power Systems for Surface Missions',
  },
  {
    id: 'COM-001',
    titulo: 'Perda de comunicação com a Terra',
    categoria: 'Distância da Terra',
    sistema: 'Comunicação',
    criticidade: 'media',
    ridge: 'D',
    identificacao: [
      'Sem resposta após 2 janelas de relay consecutivas',
      'Falha no rastreamento da antena',
      'Atraso de sinal acima do esperado para a época',
    ],
    avaliacao: [
      'Confirmar se é falha local ou interrupção do enlace',
      'Verificar alinhamento da antena',
      'Checar se há conjunção solar prevista',
    ],
    procedimento: [
      'Manter operação normal; a perda de comunicação não é emergência isolada',
      'Tentar relay por rovers e orbitadores',
      'Registrar todas as decisões tomadas sem orientação da Terra',
      'Não alterar o plano de missão por falta de comunicação',
    ],
    recursos: [
      'Antena de alto ganho',
      'Relays orbitais (Odyssey, MRO)',
      'Registro de decisões autônomas',
    ],
    criterioResolucao: [
      'Enlace de dados restabelecido',
      'Confirmação de recebimento pela Terra',
    ],
    referencia: 'NASA · Mars Relay Network',
  },
  {
    id: 'MED-001',
    titulo: 'Crise de saúde psicológica',
    categoria: 'Isolamento e confinamento',
    sistema: 'Saúde da tripulação',
    criticidade: 'media',
    ridge: 'I',
    identificacao: [
      'Alteração de sono por mais de 3 sóis consecutivos',
      'Isolamento voluntário prolongado',
      'Conflito interpessoal recorrente',
      'Dificuldade de concentração em tarefas críticas',
    ],
    avaliacao: [
      'Conversa individual com o médico de voo',
      'Revisão da carga de trabalho e escala',
      'Verificação de sono e alimentação',
    ],
    procedimento: [
      'Reduzir carga de trabalho do tripulante afetado',
      'Garantir período de descanso protegido',
      'Agendar comunicação com a família na próxima janela',
      'Transferir tarefas críticas para outro tripulante',
    ],
    recursos: [
      'Médico de voo',
      'Protocolos de suporte psicológico',
      'Janela de comunicação prioritária',
    ],
    criterioResolucao: [
      'Sono restabelecido por 3 sóis',
      'Retorno gradual às tarefas',
      'Avaliação positiva do médico de voo',
    ],
    referencia: 'NASA Human Research Program · Isolation and Confinement',
  },
]

export const CORES_CRITICIDADE: Record<Criticidade, string> = {
  alta: 'text-critico border-critico/40 bg-critico/10',
  media: 'text-alerta border-alerta/40 bg-alerta/10',
  baixa: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
}
