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

import { t } from './i18n'

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
    titulo: t('Emergência agora'),
    pergunta: t('Algo está falhando neste momento?'),
    descricao: t('Perda de pressão, falha de oxigênio, energia, fogo ou tripulante ferido.'),
    icone: 'Siren',
  },
  {
    id: 'eva',
    titulo: t('Vou sair em EVA'),
    pergunta: t('Estou avaliando autorizar uma saída'),
    descricao: t('Verificar traje, ambiente, rota e comunicação antes de abrir a comporta.'),
    icone: 'Footprints',
  },
  {
    id: 'rota',
    titulo: t('Escolha de rota'),
    pergunta: t('Qual caminho devo seguir'),
    descricao: t('Comparar risco, tempo, consumo de O₂ e valor científico.'),
    icone: 'Route',
  },
  {
    id: 'recurso',
    titulo: t('Gestão de recurso'),
    pergunta: t('Um consumível preocupa'),
    descricao: t('Entender autonomia, consumo e quando racionar.'),
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
      pergunta: t('A pressão do habitat ou do traje está caindo?'),
      ajuda: t('Queda de pressão é a ameaça mais rápida: segundos até perda de consciência.'),
      opcoes: [
        {
          texto: t('Sim, a pressão está caindo'),
          proximo: 'e2',
        },
        {
          texto: t('Não, a pressão está estável'),
          proximo: 'e3',
        },
      ],
    },
    e2: {
      pergunta: t('Tem alguém dentro do módulo afetado?'),
      ajuda: t('A sequência correta é retirar pessoas, isolar, estabilizar e só então investigar.'),
      opcoes: [
        {
          texto: t('Sim, há tripulantes no módulo'),
          veredito: {
            nivel: 'no-go',
            titulo: t('Retirar as pessoas primeiro, depois isolar'),
            explicacao:
               t(
              t('Descompressão é emergência de segundos. Isolar antes de retirar troca um problema de estrutura por uma perda humana.'),
            ),
            acoes: [
              t('Retirar todos os tripulantes do módulo afetado'),
              t('Fechar a comporta depois da retirada'),
              t('Confirmar pressão do restante do habitat'),
              t('Reportar à Terra na próxima janela'),
            ],
            razao:
              t('A ordem não é negociável: pessoas antes de estrutura. Depois de estabilizar, investiga-se a causa.'),
            protocolo: 'ENV-001',
            link: { rotulo: t('Abrir protocolo de despressurização'), para: '/protocolos/ENV-001' },
          },
        },
        {
          texto: t('Não, o módulo está vazio'),
          veredito: {
            nivel: 'atencao',
            titulo: t('Isolar o módulo e localizar o vazamento'),
            explicacao:
               t(
              t('Sem pessoas em risco no módulo, a prioridade é conter a perda e preservar a pressão do resto do habitat.'),
            ),
            acoes: [
              t('Fechar a comporta do módulo vazio'),
              t('Monitorar a pressão dos módulos adjacentes'),
              t('Localizar a origem do vazamento por sensor e som'),
              t('Preparar kit de vedação antes de entrar no módulo'),
            ],
            razao: t('Ninguém em risco imediato, mas o vazamento ainda ameaça o habitat inteiro.'),
            protocolo: 'ENV-001',
            link: { rotulo: t('Abrir protocolo de despressurização'), para: '/protocolos/ENV-001' },
          },
        },
      ],
    },
    e3: {
      pergunta: t('A concentração de oxigênio está abaixo de 19,5%?'),
      ajuda: t('Abaixo disso, a hipóxia começa a comprometer o julgamento antes de qualquer sintoma.'),
      opcoes: [
        {
          texto: t('Sim, o oxigênio está baixo'),
          veredito: {
            nivel: 'no-go',
            titulo: t('Ativar redundância antes de qualquer outra ação'),
            explicacao:
               t(
              t('Falha de oxigênio tem uma escada: redundância, redução de esforço, máscaras, e evacuação só no fim.'),
            ),
            acoes: [
              t('Ativar o gerador redundante de oxigênio'),
              t('Reduzir esforço físico da tripulação'),
              t('Suspender toda atividade extraveicular'),
              t('Distribuir máscaras apenas se a queda continuar'),
              t('Calcular autonomia com a reserva atual'),
            ],
            razao:
              t('Ativar a redundância resolve em minutos. Máscaras consomem reserva mais rápido e são para quando já não há margem.'),
            protocolo: 'LSS-001',
            link: { rotulo: t('Abrir protocolo de falha de oxigênio'), para: '/protocolos/LSS-001' },
          },
        },
        {
          texto: t('Não, o oxigênio está normal'),
          proximo: 'e4',
        },
      ],
    },
    e4: {
      pergunta: t('Há falha de energia ou incêndio?'),
      ajuda: t('Falha de energia em cascata pode derrubar suporte à vida e aquecimento.'),
      opcoes: [
        {
          texto: t('Sim, energia ou incêndio'),
          veredito: {
            nivel: 'no-go',
            titulo: t('Priorizar suporte à vida, aquecimento e comunicação'),
            explicacao:
               t(
              t('Desligar tudo cria uma segunda emergência. O correto é reduzir seletivamente e proteger o essencial.'),
            ),
            acoes: [
              t('Desligar apenas sistemas não essenciais'),
              t('Proteger suporte à vida, aquecimento e comunicação'),
              t('Isolar o consumidor com falha'),
              t('Acionar fonte auxiliar de energia'),
              t('Calcular tempo até falha do suporte à vida'),
            ],
            razao:
              t('O que mantém as pessoas vivas nunca é desligado para salvar outro sistema.'),
            protocolo: 'PWR-001',
            link: { rotulo: t('Abrir protocolo de falha energética'), para: '/protocolos/PWR-001' },
          },
        },
        {
          texto: t('Não, nada disso'),
          veredito: {
            nivel: 'atencao',
            titulo: t('Revisar os indicadores antes de agir'),
            explicacao:
               t(
              t('Sem ameaça de pressão, oxigênio ou energia, não há emergência imediata. Evite ação precipitada.'),
            ),
            acoes: [
              t('Conferir os cinco riscos RIDGE'),
              t('Verificar se há tripulante com sintoma'),
              t('Consultar radiação e clima antes de qualquer saída'),
              t('Registrar a anomalia observada'),
            ],
            razao:
              t('Agir sem diagnóstico em sistema estável pode criar a falha que se queria evitar.'),
            link: { rotulo: t('Ver avaliação RIDGE'), para: '/sobrevivencia' },
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
      pergunta: t('A temperatura externa está acima de −40 °C?'),
      ajuda: t('Abaixo disso, o risco de congelamento e o choque térmico do traje aumentam rápido.'),
      opcoes: [
        {
          texto: t('Sim, está acima do limite'),
          proximo: 'v2',
        },
        {
          texto: t('Não, está muito frio'),
          veredito: {
            nivel: 'no-go',
            titulo: t('EVA não autorizada por temperatura'),
            explicacao:
               t(
              t('Marte varia de −153 °C a +20 °C. Abaixo de −40 °C, a saída expõe a tripulação a congelamento em minutos.'),
            ),
            acoes: [
              t('Adiar a EVA para a janela diurna mais quente'),
              t('Verificar se o objetivo pode ser feito de dentro do habitat'),
              t('Se urgente, confirmar aquecedores do traje e reduzir a duração'),
            ],
            razao:
              t('Nenhum objetivo científico justifica expor a tripulação a congelamento evitável.'),
            protocolo: 'ENV-002',
            link: { rotulo: t('Abrir protocolo de tempestade'), para: '/protocolos/ENV-002' },
          },
        },
      ],
    },
    v2: {
      pergunta: t('A radiação acumulada permite mais uma exposição?'),
      ajuda: t('A dose se acumula durante toda a missão. O limite de carreira é 1 Sv.'),
      opcoes: [
        {
          texto: t('Sim, há margem de dose'),
          proximo: 'v3',
        },
        {
          texto: t('Não, o limite está próximo'),
          veredito: {
            nivel: 'no-go',
            titulo: t('EVA não autorizada por radiação'),
            explicacao:
               t(
              t('O dano da radiação se acumula e não é reversível. Ultrapassar o limite de carreira compromete a missão inteira.'),
            ),
            acoes: [
              t('Cancelar a saída externa'),
              t('Executar a tarefa por teleoperação de rover, se possível'),
              t('Registrar a dose consumida'),
              t('Replanejar para depois de uma janela de menor atividade solar'),
            ],
            razao: t('Dose acumulada é o único recurso que não se recupera.'),
            protocolo: 'ENV-001',
            link: { rotulo: t('Ver avaliação de radiação'), para: '/sobrevivencia' },
          },
        },
      ],
    },
    v3: {
      pergunta: t('O traje e a comunicação foram verificados?'),
      ajuda: t('Traje íntegro e enlace de rádio são pré-requisitos absolutos, não itens de conveniência.'),
      opcoes: [
        {
          texto: t('Sim, traje e rádio conferidos'),
          proximo: 'v4',
        },
        {
          texto: t('Ainda não'),
          veredito: {
            nivel: 'atencao',
            titulo: t('Completar a verificação antes de autorizar'),
            explicacao:
               t(
              t('Sem traje íntegro e comunicação funcionando, a EVA não tem como ser socorrida.'),
            ),
            acoes: [
              t('Percorrer o checklist de EVA completo'),
              t('Verificar vedação e pressão do traje'),
              t('Testar rádio com o habitat e com o relay'),
              t('Confirmar reserva de O₂ com 30% de margem'),
            ],
            razao:
              t('A verificação não é burocracia: é a diferença entre uma saída e um resgate impossível.'),
            link: { rotulo: t('Abrir checklist de EVA'), para: '/eva' },
          },
        },
      ],
    },
    v4: {
      pergunta: t('A opacidade de poeira (τ) está abaixo de 1,5?'),
      ajuda: t('Acima de 1,5, a visibilidade cai rápido e a equipe pode se perder perto do habitat.'),
      opcoes: [
        {
          texto: t('Sim, a poeira está controlada'),
          veredito: {
            nivel: 'go',
            titulo: t('EVA autorizada — complete o checklist'),
            explicacao:
               t(
              t('Temperatura, radiação, traje e visibilidade estão dentro dos limites. A saída pode prosseguir.'),
            ),
            acoes: [
              t('Percorrer o checklist completo de EVA'),
              t('Avisar a tripulação de apoio dentro do habitat'),
              t('Definir horário de check-in por rádio'),
              t('Registrar a dose de radiação ao retornar'),
            ],
            razao:
              t('Todos os fatores que bloqueiam a saída estão alinhados. Mantenha o monitoramento durante a atividade.'),
            link: { rotulo: t('Abrir checklist de EVA'), para: '/eva' },
          },
        },
        {
          texto: t('Não, há muita poeira'),
          veredito: {
            nivel: 'no-go',
            titulo: t('EVA não autorizada por poeira'),
            explicacao:
               t(
              t('Tempestades de poeira degradam a visibilidade e a energia. Em τ acima de 1,5 a navegação fica insegura.'),
            ),
            acoes: [
              t('Suspender a saída'),
              t('Proteger entradas de ar dos filtros'),
              t('Priorizar energia para suporte à vida'),
            ],
            razao: t('Perder a referência do habitat a poucos metros é um risco real em poeira densa.'),
            protocolo: 'ENV-002',
            link: { rotulo: t('Abrir protocolo de tempestade'), para: '/protocolos/ENV-002' },
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
      pergunta: t('O objetivo principal é científico?'),
      ajuda: t('Rotas com mais alvos custam mais tempo, oxigênio e exposição.'),
      opcoes: [
        {
          texto: t('Sim, preciso visitar alvos'),
          proximo: 'r2',
        },
        {
          texto: t('Não, é manutenção ou retorno rápido'),
          veredito: {
            nivel: 'go',
            titulo: t('Priorizar a rota de segurança e economia'),
            explicacao:
               t(
              t('Sem objetivo científico, a rota mais curta e plana reduz exposição sem perda de valor.'),
            ),
            acoes: [
              t('Selecionar a rota de menor inclinação'),
              t('Confirmar consumo de O₂ abaixo de 55%'),
              t('Comparar no planejador antes de definir'),
            ],
            razao: t('Exposição sem retorno científico é risco desnecessário.'),
            link: { rotulo: t('Comparar rotas'), para: '/rotas' },
          },
        },
      ],
    },
    r2: {
      pergunta: t('O oxigênio disponível suporta a rota mais longa?'),
      ajuda: t('A rota de máximo científico consome ~62% do O₂; a de segurança, ~49%.'),
      opcoes: [
        {
          texto: t('Sim, há margem'),
          veredito: {
            nivel: 'atencao',
            titulo: t('Rota científica viável, com ressalva de inclinação'),
            explicacao:
               t(
              t('A rota científica atravessa encosta de 24°, acima da faixa confortável. Exige redução de velocidade.'),
            ),
            acoes: [
              t('Selecionar a rota de máximo científico'),
              t('Reduzir velocidade na encosta acima de 20°'),
              t('Definir ponto de retorno antes do trecho mais íngreme'),
              t('Confirmar reserva de O₂ para o retorno'),
            ],
            razao:
              t('A rota é viável, mas a inclinação é o fator de risco: planeje o retorno antes de entrar no trecho íngreme.'),
            link: { rotulo: t('Ver perfil de inclinação'), para: '/rotas' },
          },
        },
        {
          texto: t('Não, o O₂ está apertado'),
          veredito: {
            nivel: 'no-go',
            titulo: t('Reduzir o escopo da saída'),
            explicacao:
               t(
              t('Com oxigênio apertado, a rota longa deixa margem insuficiente para imprevisto no retorno.'),
            ),
            acoes: [
              t('Escolher a rota de segurança e economia'),
              t('Visitar apenas os alvos de prioridade alta mais próximos'),
              t('Reavaliar após reposição de O₂'),
            ],
            razao: t('A margem de oxigênio é o que permite reagir a um imprevisto.'),
            link: { rotulo: t('Comparar rotas'), para: '/rotas' },
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
      pergunta: t('Qual recurso preocupa?'),
      ajuda: t('A autonomia é calculada pelo consumo diário multiplicado pela tripulação.'),
      opcoes: [
        {
          texto: t('Oxigênio ou água'),
          veredito: {
            nivel: 'atencao',
            titulo: t('Recursos críticos para a vida — prioridade máxima'),
            explicacao:
               t(
              t('Oxigênio e água não têm substituto. Abaixo de 25% da capacidade, o racionamento passa a ser obrigatório.'),
            ),
            acoes: [
              t('Calcular autonomia em sóis'),
              t('Suspender EVA e reduzir esforço físico'),
              t('Ativar reciclagem de água em ciclo máximo'),
              t('Reportar à Terra na próxima janela'),
            ],
            razao: t('Sem água e oxigênio não há como esperar reposição: não existe reabastecimento em Marte.'),
            protocolo: 'LSS-001',
            link: { rotulo: t('Abrir protocolo de oxigênio'), para: '/protocolos/LSS-001' },
          },
        },
        {
          texto: t('Energia ou alimento'),
          veredito: {
            nivel: 'go',
            titulo: t('Racionamento planejado, sem urgência imediata'),
            explicacao:
               t(
              t('Energia e alimento têm mais folga, mas energia cai rápido durante tempestades de poeira.'),
            ),
            acoes: [
              t('Conferir autonomia em sóis'),
              t('Adiar tarefas não essenciais'),
              t('Priorizar energia para suporte à vida e aquecimento'),
              t('Replanejar consumo com base na previsão de poeira'),
            ],
            razao:
              t('Ainda há margem, mas uma tempestade longa pode derrubar a geração solar rapidamente.'),
            link: { rotulo: t('Ver recursos no Centro de Missão'), para: '/' },
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
