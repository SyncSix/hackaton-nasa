/**
 * Cenários do simulador de emergências.
 *
 * AVISO: cenários ILUSTRATIVOS, construídos para demonstrar a experiência
 * de tomada de decisão do protótipo. As respostas corretas refletem
 * princípios gerais de segurança de missão (priorizar a tripulação,
 * isolar o problema, não agravar o risco), mas NÃO constituem
 * procedimento operacional validado.
 */

export type Opcao = {
  id: string
  texto: string
  /** Se é a decisão recomendada. */
  correta: boolean
  /** Consequência da escolha. */
  consequencia: string
  /** Por que é certa ou errada. */
  justificativa: string
}

export type Cenario = {
  id: string
  numero: string
  titulo: string
  /** Categoria RIDGE. */
  ridge: string
  contexto: string
  situacao: string
  opcoes: Opcao[]
  /** Protocolo relacionado. */
  protocolo?: string
  /** Lição principal do cenário. */
  licao: string
}

export const CENARIOS: Cenario[] = [
  {
    id: 'SIM-001',
    numero: '001',
    titulo: 'Tempestade de poeira aproximando',
    ridge: 'E',
    contexto:
      'Sol 1.742, 14:32 LMST. A opacidade de poeira subiu de 0,84 para 1,7 nas últimas duas horas. A equipe está em EVA a 2,3 km do habitat, com 40% do oxigênio do traje consumido.',
    situacao:
      'A tempestade está se aproximando do habitat. A equipe está realizando atividade externa. Qual deve ser sua prioridade?',
    opcoes: [
      {
        id: 'A',
        texto: 'Priorizar o retorno da equipe e avaliar a segurança do habitat.',
        correta: true,
        consequencia:
          'A equipe retorna em 38 minutos, antes do pico da tempestade. O habitat é preparado para a redução de energia solar.',
        justificativa:
          'A vida da tripulação vem antes de qualquer objetivo científico. Com τ acima de 1,5, a visibilidade e a navegação degradam rápido, e o retorno fica mais difícil a cada minuto.',
      },
      {
        id: 'B',
        texto: 'Continuar a atividade até concluir o objetivo científico.',
        correta: false,
        consequencia:
          'A visibilidade cai para menos de 50 m. A equipe perde a referência do habitat e consome oxigênio de reserva procurando o caminho.',
        justificativa:
          'Nenhum dado científico justifica expor a tripulação a uma tempestade. A perda de visibilidade é o fator mais perigoso: sem referência, a equipe pode se perder a poucos metros do habitat.',
      },
      {
        id: 'C',
        texto: 'Desligar todos os sistemas do habitat imediatamente.',
        correta: false,
        consequencia:
          'O habitat perde aquecimento e suporte à vida. A equipe retorna para um ambiente inóspito.',
        justificativa:
          'Desligar tudo cria uma segunda emergência. O correto é reduzir sistemas não essenciais, mantendo suporte à vida, aquecimento e comunicação.',
      },
    ],
    protocolo: 'ENV-002',
    licao:
      'Em risco ambiental crescente, a prioridade é sempre trazer a tripulação para dentro. Depois se protege o habitat, sem desligar o que mantém as pessoas vivas.',
  },
  {
    id: 'SIM-002',
    numero: '002',
    titulo: 'Queda de pressão no módulo de habitação',
    ridge: 'E',
    contexto:
      'Sol 1.743, 03:14 LMST. O alarme de integridade estrutural dispara. A pressão do módulo B cai 0,8 kPa por minuto. Dois tripulantes dormem nesse módulo.',
    situacao:
      'A pressão continua caindo e o módulo B está isolado por comporta. O que você faz primeiro?',
    opcoes: [
      {
        id: 'A',
        texto: 'Acordar e retirar os tripulantes do módulo B, depois isolar.',
        correta: true,
        consequencia:
          'Os dois tripulantes saem em 90 segundos. A comporta é fechada e a pressão do resto do habitat se estabiliza.',
        justificativa:
          'Pessoas primeiro, estrutura depois. Isolar sem retirar a tripulação condenaria quem está dentro. A ordem correta é retirar, isolar e então investigar.',
      },
      {
        id: 'B',
        texto: 'Fechar a comporta imediatamente para salvar a pressão do habitat.',
        correta: false,
        consequencia:
          'A pressão do habitat se estabiliza, mas dois tripulantes ficam presos em um módulo em descompressão.',
        justificativa:
          'Isolar antes de retirar as pessoas troca um problema de estrutura por uma perda humana. A comporta deve ser fechada depois da retirada, não antes.',
      },
      {
        id: 'C',
        texto: 'Procurar a origem do vazamento antes de agir.',
        correta: false,
        consequencia:
          'A pressão cai abaixo do limite de sobrevivência enquanto a busca acontece. Os tripulantes do módulo B perdem consciência.',
        justificativa:
          'Diagnóstico vem depois do resgate. Em descompressão, cada segundo conta: primeiro se protegem as pessoas, depois se investiga a causa.',
      },
    ],
    protocolo: 'ENV-001',
    licao:
      'Descompressão é emergência de segundos. A sequência é sempre: retirar pessoas, isolar o módulo, estabilizar, e só então investigar a causa.',
  },
  {
    id: 'SIM-003',
    numero: '003',
    titulo: 'Falha no gerador de oxigênio',
    ridge: 'E',
    contexto:
      'Sol 1.745, 09:40 LMST. O gerador primário de oxigênio falha. A concentração de O₂ no habitat cai de 21% para 17,8% em 20 minutos. A reserva gasosa dá 6 horas.',
    situacao:
      'A concentração continua caindo. Qual é a primeira ação?',
    opcoes: [
      {
        id: 'A',
        texto: 'Ativar o gerador redundante e reduzir esforço físico da tripulação.',
        correta: true,
        consequencia:
          'O gerador redundante assume em 4 minutos. A concentração estabiliza em 20,4%.',
        justificativa:
          'Ativar a redundância é a resposta imediata. Reduzir esforço físico diminui o consumo de oxigênio enquanto o sistema se estabiliza.',
      },
      {
        id: 'B',
        texto: 'Distribuir máscaras de emergência imediatamente.',
        correta: false,
        consequencia:
          'As máscaras consomem a reserva gasosa mais rápido. A autonomia cai de 6 horas para 2 horas.',
        justificativa:
          'Máscaras são para quando a concentração já está em nível perigoso. Com 17,8% ainda há margem para ativar a redundância primeiro, preservando a reserva.',
      },
      {
        id: 'C',
        texto: 'Evacuar o habitat para o módulo de reserva.',
        correta: false,
        consequencia:
          'A evacuação consome tempo e oxigênio. O gerador redundante, que resolveria em 4 minutos, nunca é ativado.',
        justificativa:
          'Evacuar é a última opção, não a primeira. Só se justifica quando a falha é irreparável e a reserva não cobre o tempo de reparo.',
      },
    ],
    protocolo: 'LSS-001',
    licao:
      'Falha de suporte à vida tem uma escada de resposta: redundância, depois redução de consumo, depois máscaras, e evacuação só no fim.',
  },
  {
    id: 'SIM-004',
    numero: '004',
    titulo: 'Perda de comunicação durante conjunção solar',
    ridge: 'D',
    contexto:
      'Sol 1.751, 11:05 LMST. A Terra não responde há 3 janelas de relay consecutivas. O atraso esperado para esta época é de 22 minutos. Um tripulante apresenta dor abdominal forte.',
    situacao:
      'Sem contato com a Terra e com um tripulante doente, qual é a decisão?',
    opcoes: [
      {
        id: 'A',
        texto: 'Tratar o tripulante com o protocolo médico autônomo e registrar as decisões.',
        correta: true,
        consequencia:
          'O médico de voo aplica o protocolo autônomo. O quadro estabiliza. As decisões ficam registradas para reportar quando o enlace voltar.',
        justificativa:
          'A tripulação precisa operar de forma autônoma. Esperar autorização da Terra, com 22 minutos de atraso e sem enlace, é o mesmo que não tratar.',
      },
      {
        id: 'B',
        texto: 'Aguardar o restabelecimento do contato para receber orientação.',
        correta: false,
        consequencia:
          'O quadro evolui para complicação enquanto a equipe espera. O tratamento chega tarde.',
        justificativa:
          'A distância da Terra é um risco por si só. Protocolos autônomos existem justamente porque a orientação em tempo real é impossível.',
      },
      {
        id: 'C',
        texto: 'Alterar o plano da missão para antecipar o retorno à Terra.',
        correta: false,
        consequencia:
          'A alteração consome recursos e não resolve o quadro clínico imediato.',
        justificativa:
          'Perda de comunicação não é, por si só, motivo para mudar o plano. A resposta é tratar localmente e registrar, não replanejar a missão.',
      },
    ],
    protocolo: 'COM-001',
    licao:
      'A distância da Terra é um risco operacional permanente. A tripulação deve agir com autonomia e registrar as decisões, não esperar por instruções que não podem chegar a tempo.',
  },
  {
    id: 'SIM-005',
    numero: '005',
    titulo: 'Conflito e exaustão na tripulação',
    ridge: 'I',
    contexto:
      'Sol 1.756. Um tripulante dorme 4,5 horas por noite há 6 sóis e se recusa a participar das reuniões. Houve discussão com outro tripulante durante a manutenção.',
    situacao:
      'A carga de trabalho está alta e o prazo de uma atividade crítica se aproxima. Como agir?',
    opcoes: [
      {
        id: 'A',
        texto: 'Reduzir a carga do tripulante e garantir descanso protegido.',
        correta: true,
        consequencia:
          'Após 3 sóis de descanso protegido, o sono se restabelece e o tripulante retoma as tarefas gradualmente.',
        justificativa:
          'Isolamento e confinamento degradam a cognição antes de qualquer sintoma físico. Um tripulante exausto em tarefa crítica é um risco operacional, não um problema pessoal.',
      },
      {
        id: 'B',
        texto: 'Manter a escala para não atrasar a atividade crítica.',
        correta: false,
        consequencia:
          'O erro de procedimento ocorre durante a atividade. A falha custa mais tempo do que o descanso teria custado.',
        justificativa:
          'Pressionar uma pessoa já exausta aumenta a chance de erro em tarefa crítica. O atraso planejado é sempre menor que o custo de uma falha.',
      },
      {
        id: 'C',
        texto: 'Transferir todas as tarefas do tripulante para os outros.',
        correta: false,
        consequencia:
          'A carga dos demais sobe e um segundo tripulante entra em exaustão.',
        justificativa:
          'Transferir tudo apenas desloca o problema. O correto é reduzir a carga e redistribuir de forma sustentável, com descanso protegido.',
      },
    ],
    protocolo: 'MED-001',
    licao:
      'O risco psicológico é tão operacional quanto o ambiental. Sono e carga de trabalho afetam diretamente a qualidade das decisões em emergência.',
  },
]

export const TOTAL_CENARIOS = CENARIOS.length
