/**
 * Guia de decisão.
 *
 * Estrutura: o astronauta escolhe o TIPO de situação; o sistema conduz por
 * perguntas de triagem até um veredito com a ação recomendada.
 *
 * Os roteiros demonstram a lógica de decisão do protótipo e seguem o
 * princípio do documento de projeto — "observar, contextualizar, planejar,
 * decidir" — com prioridade por letalidade. Não são procedimentos
 * operacionais validados.
 */

export type TipoSituacao = {
  id: string
  titulo: string
  pergunta: string
  descricao: string
  icone: 'Siren' | 'Footprints' | 'Route' | 'Package'
}

export const TIPOS: TipoSituacao[] = [
  {
    id: 'emergencia',
    titulo: 'Emergência agora',
    pergunta: 'Algo está falhando neste momento?',
    descricao: 'Perda de pressão, falha de oxigênio, energia, fogo ou tripulante ferido.',
    icone: 'Siren',
  },
  {
    id: 'eva',
    titulo: 'Vou sair em EVA',
    pergunta: 'Estou avaliando autorizar uma saída',
    descricao: 'Verificar traje, ambiente, rota e comunicação antes de abrir a comporta.',
    icone: 'Footprints',
  },
  {
    id: 'rota',
    titulo: 'Escolha de rota',
    pergunta: 'Qual caminho devo seguir',
    descricao: 'Comparar risco, tempo, consumo de O₂ e valor científico.',
    icone: 'Route',
  },
  {
    id: 'recurso',
    titulo: 'Gestão de recurso',
    pergunta: 'Um consumível preocupa',
    descricao: 'Entender autonomia, consumo e quando racionar.',
    icone: 'Package',
  },
]

export type Passo = {
  pergunta: string
  /** Contexto que ajuda a responder. */
  ajuda: string
  opcoes: Array<{
    texto: string
    /** Próximo nó. Se ausente, é um veredito. */
    proximo?: string
    veredito?: Veredito
  }>
}

export type Veredito = {
  nivel: 'go' | 'atencao' | 'no-go'
  titulo: string
  explicacao: string
  /** O que fazer, em ordem. */
  acoes: string[]
  /** Por que essa é a prioridade. */
  razao: string
  protocolo?: string
  link?: { rotulo: string; para: string }
}

export type Roteiro = {
  inicio: string
  nos: Record<string, Passo>
}

/** Emergência: triagem por letalidade — qual ameaça é mais urgente. */
const EMERGENCIA: Roteiro = {
  inicio: 'e1',
  nos: {
    e1: {
      pergunta: 'A pressão do habitat ou do traje está caindo?',
      ajuda: 'Queda de pressão é a ameaça mais rápida: segundos até perda de consciência.',
      opcoes: [
        {
          texto: 'Sim, a pressão está caindo',
          proximo: 'e2',
        },
        {
          texto: 'Não, a pressão está estável',
          proximo: 'e3',
        },
      ],
    },
    e2: {
      pergunta: 'Tem alguém dentro do módulo afetado?',
      ajuda: 'A sequência correta é retirar pessoas, isolar, estabilizar e só então investigar.',
      opcoes: [
        {
          texto: 'Sim, há tripulantes no módulo',
          veredito: {
            nivel: 'no-go',
            titulo: 'Retirar as pessoas primeiro, depois isolar',
            explicacao:
              'Descompressão é emergência de segundos. Isolar antes de retirar troca um problema de estrutura por uma perda humana.',
            acoes: [
              'Retirar todos os tripulantes do módulo afetado',
              'Fechar a comporta depois da retirada',
              'Confirmar pressão do restante do habitat',
              'Reportar à Terra na próxima janela',
            ],
            razao:
              'A ordem não é negociável: pessoas antes de estrutura. Depois de estabilizar, investiga-se a causa.',
            protocolo: 'ENV-001',
            link: { rotulo: 'Abrir protocolo de despressurização', para: '/protocolos/ENV-001' },
          },
        },
        {
          texto: 'Não, o módulo está vazio',
          veredito: {
            nivel: 'atencao',
            titulo: 'Isolar o módulo e localizar o vazamento',
            explicacao:
              'Sem pessoas em risco no módulo, a prioridade é conter a perda e preservar a pressão do resto do habitat.',
            acoes: [
              'Fechar a comporta do módulo vazio',
              'Monitorar a pressão dos módulos adjacentes',
              'Localizar a origem do vazamento por sensor e som',
              'Preparar kit de vedação antes de entrar no módulo',
            ],
            razao: 'Ninguém em risco imediato, mas o vazamento ainda ameaça o habitat inteiro.',
            protocolo: 'ENV-001',
            link: { rotulo: 'Abrir protocolo de despressurização', para: '/protocolos/ENV-001' },
          },
        },
      ],
    },
    e3: {
      pergunta: 'A concentração de oxigênio está abaixo de 19,5%?',
      ajuda: 'Abaixo disso, a hipóxia começa a comprometer o julgamento antes de qualquer sintoma.',
      opcoes: [
        {
          texto: 'Sim, o oxigênio está baixo',
          veredito: {
            nivel: 'no-go',
            titulo: 'Ativar redundância antes de qualquer outra ação',
            explicacao:
              'Falha de oxigênio tem uma escada: redundância, redução de esforço, máscaras, e evacuação só no fim.',
            acoes: [
              'Ativar o gerador redundante de oxigênio',
              'Reduzir esforço físico da tripulação',
              'Suspender toda atividade extraveicular',
              'Distribuir máscaras apenas se a queda continuar',
              'Calcular autonomia com a reserva atual',
            ],
            razao:
              'Ativar a redundância resolve em minutos. Máscaras consomem reserva mais rápido e são para quando já não há margem.',
            protocolo: 'LSS-001',
            link: { rotulo: 'Abrir protocolo de falha de oxigênio', para: '/protocolos/LSS-001' },
          },
        },
        {
          texto: 'Não, o oxigênio está normal',
          proximo: 'e4',
        },
      ],
    },
    e4: {
      pergunta: 'Há falha de energia ou incêndio?',
      ajuda: 'Falha de energia em cascata pode derrubar suporte à vida e aquecimento.',
      opcoes: [
        {
          texto: 'Sim, energia ou incêndio',
          veredito: {
            nivel: 'no-go',
            titulo: 'Priorizar suporte à vida, aquecimento e comunicação',
            explicacao:
              'Desligar tudo cria uma segunda emergência. O correto é reduzir seletivamente e proteger o essencial.',
            acoes: [
              'Desligar apenas sistemas não essenciais',
              'Proteger suporte à vida, aquecimento e comunicação',
              'Isolar o consumidor com falha',
              'Acionar fonte auxiliar de energia',
              'Calcular tempo até falha do suporte à vida',
            ],
            razao:
              'O que mantém as pessoas vivas nunca é desligado para salvar outro sistema.',
            protocolo: 'PWR-001',
            link: { rotulo: 'Abrir protocolo de falha energética', para: '/protocolos/PWR-001' },
          },
        },
        {
          texto: 'Não, nada disso',
          veredito: {
            nivel: 'atencao',
            titulo: 'Revisar os indicadores antes de agir',
            explicacao:
              'Sem ameaça de pressão, oxigênio ou energia, não há emergência imediata. Evite ação precipitada.',
            acoes: [
              'Conferir os cinco riscos RIDGE',
              'Verificar se há tripulante com sintoma',
              'Consultar radiação e clima antes de qualquer saída',
              'Registrar a anomalia observada',
            ],
            razao:
              'Agir sem diagnóstico em sistema estável pode criar a falha que se queria evitar.',
            link: { rotulo: 'Ver avaliação RIDGE', para: '/sobrevivencia' },
          },
        },
      ],
    },
  },
}

/** EVA: autorização guiada pelos itens que bloqueiam a saída. */
const EVA: Roteiro = {
  inicio: 'v1',
  nos: {
    v1: {
      pergunta: 'A temperatura externa está acima de −40 °C?',
      ajuda: 'Abaixo disso, o risco de congelamento e o choque térmico do traje aumentam rápido.',
      opcoes: [
        {
          texto: 'Sim, está acima do limite',
          proximo: 'v2',
        },
        {
          texto: 'Não, está muito frio',
          veredito: {
            nivel: 'no-go',
            titulo: 'EVA não autorizada por temperatura',
            explicacao:
              'Marte varia de −153 °C a +20 °C. Abaixo de −40 °C, a saída expõe a tripulação a congelamento em minutos.',
            acoes: [
              'Adiar a EVA para a janela diurna mais quente',
              'Verificar se o objetivo pode ser feito de dentro do habitat',
              'Se urgente, confirmar aquecedores do traje e reduzir a duração',
            ],
            razao:
              'Nenhum objetivo científico justifica expor a tripulação a congelamento evitável.',
            protocolo: 'ENV-002',
            link: { rotulo: 'Abrir protocolo de tempestade', para: '/protocolos/ENV-002' },
          },
        },
      ],
    },
    v2: {
      pergunta: 'A radiação acumulada permite mais uma exposição?',
      ajuda: 'A dose se acumula durante toda a missão. O limite de carreira é 1 Sv.',
      opcoes: [
        {
          texto: 'Sim, há margem de dose',
          proximo: 'v3',
        },
        {
          texto: 'Não, o limite está próximo',
          veredito: {
            nivel: 'no-go',
            titulo: 'EVA não autorizada por radiação',
            explicacao:
              'O dano da radiação se acumula e não é reversível. Ultrapassar o limite de carreira compromete a missão inteira.',
            acoes: [
              'Cancelar a saída externa',
              'Executar a tarefa por teleoperação de rover, se possível',
              'Registrar a dose consumida',
              'Replanejar para depois de uma janela de menor atividade solar',
            ],
            razao: 'Dose acumulada é o único recurso que não se recupera.',
            protocolo: 'ENV-001',
            link: { rotulo: 'Ver avaliação de radiação', para: '/sobrevivencia' },
          },
        },
      ],
    },
    v3: {
      pergunta: 'O traje e a comunicação foram verificados?',
      ajuda: 'Traje íntegro e enlace de rádio são pré-requisitos absolutos, não itens de conveniência.',
      opcoes: [
        {
          texto: 'Sim, traje e rádio conferidos',
          proximo: 'v4',
        },
        {
          texto: 'Ainda não',
          veredito: {
            nivel: 'atencao',
            titulo: 'Completar a verificação antes de autorizar',
            explicacao:
              'Sem traje íntegro e comunicação funcionando, a EVA não tem como ser socorrida.',
            acoes: [
              'Percorrer o checklist de EVA completo',
              'Verificar vedação e pressão do traje',
              'Testar rádio com o habitat e com o relay',
              'Confirmar reserva de O₂ com 30% de margem',
            ],
            razao:
              'A verificação não é burocracia: é a diferença entre uma saída e um resgate impossível.',
            link: { rotulo: 'Abrir checklist de EVA', para: '/eva' },
          },
        },
      ],
    },
    v4: {
      pergunta: 'A opacidade de poeira (τ) está abaixo de 1,5?',
      ajuda: 'Acima de 1,5, a visibilidade cai rápido e a equipe pode se perder perto do habitat.',
      opcoes: [
        {
          texto: 'Sim, a poeira está controlada',
          veredito: {
            nivel: 'go',
            titulo: 'EVA autorizada — complete o checklist',
            explicacao:
              'Temperatura, radiação, traje e visibilidade estão dentro dos limites. A saída pode prosseguir.',
            acoes: [
              'Percorrer o checklist completo de EVA',
              'Avisar a tripulação de apoio dentro do habitat',
              'Definir horário de check-in por rádio',
              'Registrar a dose de radiação ao retornar',
            ],
            razao:
              'Todos os fatores que bloqueiam a saída estão alinhados. Mantenha o monitoramento durante a atividade.',
            link: { rotulo: 'Abrir checklist de EVA', para: '/eva' },
          },
        },
        {
          texto: 'Não, há muita poeira',
          veredito: {
            nivel: 'no-go',
            titulo: 'EVA não autorizada por poeira',
            explicacao:
              'Tempestades de poeira degradam a visibilidade e a energia. Em τ acima de 1,5 a navegação fica insegura.',
            acoes: [
              'Suspender a saída',
              'Proteger entradas de ar dos filtros',
              'Priorizar energia para suporte à vida',
            ],
            razao: 'Perder a referência do habitat a poucos metros é um risco real em poeira densa.',
            protocolo: 'ENV-002',
            link: { rotulo: 'Abrir protocolo de tempestade', para: '/protocolos/ENV-002' },
          },
        },
      ],
    },
  },
}

/** Rota: escolha guiada pela prioridade da saída. */
const ROTA: Roteiro = {
  inicio: 'r1',
  nos: {
    r1: {
      pergunta: 'O objetivo principal é científico?',
      ajuda: 'Rotas com mais alvos custam mais tempo, oxigênio e exposição.',
      opcoes: [
        {
          texto: 'Sim, preciso visitar alvos',
          proximo: 'r2',
        },
        {
          texto: 'Não, é manutenção ou retorno rápido',
          veredito: {
            nivel: 'go',
            titulo: 'Priorizar a rota de segurança e economia',
            explicacao:
              'Sem objetivo científico, a rota mais curta e plana reduz exposição sem perda de valor.',
            acoes: [
              'Selecionar a rota de menor inclinação',
              'Confirmar consumo de O₂ abaixo de 55%',
              'Comparar no planejador antes de definir',
            ],
            razao: 'Exposição sem retorno científico é risco desnecessário.',
            link: { rotulo: 'Comparar rotas', para: '/rotas' },
          },
        },
      ],
    },
    r2: {
      pergunta: 'O oxigênio disponível suporta a rota mais longa?',
      ajuda: 'A rota de máximo científico consome ~62% do O₂; a de segurança, ~49%.',
      opcoes: [
        {
          texto: 'Sim, há margem',
          veredito: {
            nivel: 'atencao',
            titulo: 'Rota científica viável, com ressalva de inclinação',
            explicacao:
              'A rota científica atravessa encosta de 24°, acima da faixa confortável. Exige redução de velocidade.',
            acoes: [
              'Selecionar a rota de máximo científico',
              'Reduzir velocidade na encosta acima de 20°',
              'Definir ponto de retorno antes do trecho mais íngreme',
              'Confirmar reserva de O₂ para o retorno',
            ],
            razao:
              'A rota é viável, mas a inclinação é o fator de risco: planeje o retorno antes de entrar no trecho íngreme.',
            link: { rotulo: 'Ver perfil de inclinação', para: '/rotas' },
          },
        },
        {
          texto: 'Não, o O₂ está apertado',
          veredito: {
            nivel: 'no-go',
            titulo: 'Reduzir o escopo da saída',
            explicacao:
              'Com oxigênio apertado, a rota longa deixa margem insuficiente para imprevisto no retorno.',
            acoes: [
              'Escolher a rota de segurança e economia',
              'Visitar apenas os alvos de prioridade alta mais próximos',
              'Reavaliar após reposição de O₂',
            ],
            razao: 'A margem de oxigênio é o que permite reagir a um imprevisto.',
            link: { rotulo: 'Comparar rotas', para: '/rotas' },
          },
        },
      ],
    },
  },
}

/** Recurso: guia de racionamento. */
const RECURSO: Roteiro = {
  inicio: 'c1',
  nos: {
    c1: {
      pergunta: 'Qual recurso preocupa?',
      ajuda: 'A autonomia é calculada pelo consumo diário multiplicado pela tripulação.',
      opcoes: [
        {
          texto: 'Oxigênio ou água',
          veredito: {
            nivel: 'atencao',
            titulo: 'Recursos críticos para a vida — prioridade máxima',
            explicacao:
              'Oxigênio e água não têm substituto. Abaixo de 25% da capacidade, o racionamento passa a ser obrigatório.',
            acoes: [
              'Calcular autonomia em sóis',
              'Suspender EVA e reduzir esforço físico',
              'Ativar reciclagem de água em ciclo máximo',
              'Reportar à Terra na próxima janela',
            ],
            razao: 'Sem água e oxigênio não há como esperar reposição: não existe reabastecimento em Marte.',
            protocolo: 'LSS-001',
            link: { rotulo: 'Abrir protocolo de oxigênio', para: '/protocolos/LSS-001' },
          },
        },
        {
          texto: 'Energia ou alimento',
          veredito: {
            nivel: 'go',
            titulo: 'Racionamento planejado, sem urgência imediata',
            explicacao:
              'Energia e alimento têm mais folga, mas energia cai rápido durante tempestades de poeira.',
            acoes: [
              'Conferir autonomia em sóis',
              'Adiar tarefas não essenciais',
              'Priorizar energia para suporte à vida e aquecimento',
              'Replanejar consumo com base na previsão de poeira',
            ],
            razao:
              'Ainda há margem, mas uma tempestade longa pode derrubar a geração solar rapidamente.',
            link: { rotulo: 'Ver recursos no Centro de Missão', para: '/' },
          },
        },
      ],
    },
  },
}

export const ROTEIROS: Record<string, Roteiro> = {
  emergencia: EMERGENCIA,
  eva: EVA,
  rota: ROTA,
  recurso: RECURSO,
}
