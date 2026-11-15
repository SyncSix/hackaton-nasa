import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Keyboard,
  ListChecks,
  Radio,
  ShieldAlert,
} from 'lucide-react'
import { MISSAO } from '../lib/mission'

/**
 * Manual do sistema.
 *
 * Explica o console para dois públicos ao mesmo tempo: o astronauta que
 * precisa operá-lo e o avaliador do hackathon que precisa entendê-lo.
 * A ordem segue a importância operacional, não a ordem do menu.
 */

type Tela = {
  n: string
  nome: string
  rota: string
  resumo: string
  quando: string
  fazer: string[]
  critico?: boolean
}

const TELAS: Tela[] = [
  {
    n: '01',
    nome: 'Centro de Missão',
    rota: '/',
    resumo:
      'A tela inicial. Responde três perguntas em sequência: o que está errado agora, quanto tempo resta e o que fazer em seguida.',
    quando: 'Sempre que você abrir o sistema. É o ponto de partida de qualquer turno.',
    fazer: [
      'Leia a Central de alarmes de cima para baixo. Ela já vem ordenada por gravidade, então o primeiro item é o mais urgente.',
      'Se houver alarme crítico, use o botão do protocolo indicado em vez de procurar no menu.',
      'Use o Guia de decisão se estiver em dúvida sobre qual situação se aplica a você.',
      'Veja o painel de tripulação para saber quem está disponível e quem está fora do habitat.',
    ],
    critico: true,
  },
  {
    n: '02',
    nome: 'Sobrevivência',
    rota: '/sobrevivencia',
    resumo:
      'Os cinco perigos que a NASA usa para planejar missões humanas, no modelo RIDGE: Radiação, Isolamento, Distância, Gravidade e Ambientes.',
    quando: 'Para entender o risco de fundo da missão, não uma emergência em curso.',
    fazer: [
      'Cada categoria mostra o estado atual e o limite que não pode ser cruzado.',
      'As prioridades estão ordenadas por tempo até dano irreversível: o que mata em segundos vem primeiro.',
      'Cada risco aponta para o equipamento que o mede e para o protocolo que o trata.',
      'Use esta tela no planejamento, não durante a crise.',
    ],
  },
  {
    n: '03',
    nome: 'Protocolos',
    rota: '/protocolos',
    resumo:
      'Procedimentos passo a passo para as situações que ameaçam diretamente a tripulação e o habitat.',
    quando: 'Assim que um alarme indicar um protocolo. Não espere entender tudo para começar.',
    fazer: [
      'Abra o protocolo indicado pela Central de alarmes.',
      'Marque cada passo concluído. O sistema cronometra a execução automaticamente.',
      'Só considere a situação controlada quando os critérios de resolução estiverem atendidos.',
      'Se o procedimento não estabilizar o quadro, registre a decisão na tela de Decisões.',
    ],
    critico: true,
  },
  {
    n: '04',
    nome: 'EVA',
    rota: '/eva',
    resumo:
      'Verificações antes, durante e depois da saída ao exterior. Itens críticos bloqueiam a autorização da atividade.',
    quando: 'Antes de qualquer saída do habitat, sem exceção.',
    fazer: [
      'Percorra os itens na ordem em que aparecem, porque um item depende do anterior.',
      'Se um item crítico falhar, a atividade não é autorizada.',
      'A mesma lista está na tela inicial, para quem preferir não sair do Centro de Missão.',
      'Registre o PLSS (oxigênio, CO₂, água e bateria) antes de fechar a escotilha.',
    ],
    critico: true,
  },
  {
    n: '05',
    nome: 'Sistemas Vitais',
    rota: '/sistemas',
    resumo:
      'O que mantém a tripulação viva dentro e fora do habitat: PLSS, balanço de CO₂, abrigo solar, cadeia de frio e contaminação.',
    quando: 'Quando um alarme apontar para um destes sistemas, ou na checagem de rotina.',
    fazer: [
      'PLSS: mostra quanto tempo o traje ainda sustenta a vida e até onde dá para caminhar de volta.',
      'CO₂: mostra a remoção e se a tripulação está produzindo mais do que o sistema remove.',
      'Abrigo solar: mostra quanto falta para a tempestade e se o abrigo atende antes do pico.',
      'Cadeia de frio e contaminação: mostram amostras comprometidas e risco de contaminação planetária.',
    ],
  },
  {
    n: '06',
    nome: 'Rotas',
    rota: '/rotas',
    resumo:
      'Compara trajetos por distância, duração, inclinação, consumo de oxigênio e valor científico.',
    quando: 'Ao planejar qualquer deslocamento para fora do habitat.',
    fazer: [
      'Compare as rotas por consumo de oxigênio, não só por distância. A mais curta pode ser a mais cara.',
      'Confira os waypoints e a rota alternativa antes de partir.',
      'Verifique se a distância cabe no limite de caminhada de volta: metade da autonomia restante, com 20% de margem.',
      'Se a rota passar por zona cega de comunicação, programe um relay antes.',
    ],
  },
  {
    n: '07',
    nome: 'Exploração',
    rota: '/mapa',
    resumo:
      'Mapa real da Cratera Jezero com camadas de terreno, alvos científicos, zonas de risco e comunicação.',
    quando: 'Para decidir onde ir e o que evitar no caminho.',
    fazer: [
      'Ligue e desligue as camadas conforme a pergunta que você quer responder.',
      'Compare as imagens oficiais da NASA para ler o terreno antes de escolher a rota.',
      'As posições dos alvos são demonstrativas. No sistema real viriam do rover.',
    ],
  },
  {
    n: '08',
    nome: 'Decisões',
    rota: '/decisoes',
    resumo:
      'Registro das decisões tomadas sem orientação da Terra, com contexto, justificativa e estado do enlace.',
    quando: 'Depois de qualquer decisão autônoma, e na revisão pós-turno.',
    fazer: [
      'Registre a decisão enquanto o contexto ainda está fresco.',
      'O registro serve para auditoria da missão e para aprender com os cenários.',
      'Com atraso de 4 a 24 minutos, a Terra não pode autorizar nada em tempo real. A decisão é sempre de quem está lá.',
    ],
  },
  {
    n: '09',
    nome: 'Simulador',
    rota: '/simulador',
    resumo:
      'Cenários de risco para praticar decisões sob pressão, com a consequência e o raciocínio de cada escolha.',
    quando: 'No treinamento, antes de precisar das decisões de verdade.',
    fazer: [
      'Escolha um cenário e decida como se fosse real.',
      'Leia a consequência com atenção. É ali que o aprendizado acontece.',
      'Repita até as decisões críticas saírem sem hesitação.',
    ],
  },
  {
    n: '10',
    nome: 'Equipamentos',
    rota: '/equipamentos',
    resumo:
      'Cada indicador do sistema é produzido por um equipamento real. Esta é a cadeia completa: grandeza, instrumento, plataforma e retorno.',
    quando: 'Quando precisar saber de onde veio um número, ou se um sensor falhou.',
    fazer: [
      'Use como referência de rastreabilidade: todo dado tem origem declarada.',
      'Se um alarme parece errado, verifique aqui qual é o instrumento de origem.',
      'Os instrumentos listados alimentam diretamente os indicadores do console.',
    ],
  },
]

const GLOSSARIO: Array<{ termo: string; def: string }> = [
  {
    termo: 'RIDGE',
    def: 'Cinco categorias de risco para missões humanas: Radiação, Isolamento, Distância, Gravidade e Ambientes hostis. A NASA usa esse modelo porque o perigo em Marte não é só o clima.',
  },
  {
    termo: 'PLSS',
    def: 'A mochila do traje espacial. Fornece oxigênio, remove o gás carbônico, controla a temperatura e alimenta a comunicação. Tem autonomia limitada.',
  },
  {
    termo: 'EVA',
    def: 'Atividade extraveicular. Qualquer saída do astronauta para fora do habitat ou do veículo pressurizado.',
  },
  {
    termo: 'LMST',
    def: 'Hora local marciana. Um dia em Marte dura cerca de 40 minutos a mais que o da Terra, por isso os prazos da missão são contados em sóis.',
  },
  {
    termo: 'Sol',
    def: 'Um dia solar marciano. Equivale a 24 horas e 39 minutos na Terra.',
  },
  {
    termo: 'Walkback',
    def: 'A capacidade de voltar a pé até o habitat se o veículo falhar. Por isso, a distância máxima de uma saída é metade da autonomia do traje, com margem de segurança.',
  },
  {
    termo: 'SPE',
    def: 'Evento de Partícula Solar. Tempestade de radiação que pode ser letal em minutos ao ar livre. Exige abrigo imediato.',
  },
  {
    termo: 'MEDA',
    def: 'Instrumento de meteorologia a bordo do Perseverance que mede temperatura, vento e pressão em Jezero. É a fonte do clima local mostrado no sistema.',
  },
]

export function Manual() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-6 py-6">
      {/* CABEÇALHO */}
      <header className="card-destaque rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="label-micro">Manual operacional · Sync Six</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Como usar Sync Six: Guia de Sobrevivência em Marte
            </h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gelo/75">
              Um guia de sobrevivência para qualquer missão humana em Marte. Nesta prototipagem o
              cenário é a {MISSAO.local}, com {MISSAO.tripulacao} tripulantes no Sol {MISSAO.sol}.
              Este manual explica o que cada tela faz, em que momento usar e o que não pode ser
              esquecido. A ordem segue a importância para a sobrevivência, não a ordem do menu.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-marte/35 bg-marte/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-marte">
            <BookOpen size={11} />
            Leia uma vez
          </span>
        </div>
      </header>

      {/* COMO O SISTEMA PENSA */}
      <section className="card-glass p-5">
        <h2 className="text-[14px] font-semibold tracking-tight">Antes de tudo: como o sistema pensa</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-gelo/70">
          Sobreviver em Marte é um problema de rotina e de planejamento: água, oxigênio, energia,
          radiação, temperatura, isolamento e distância da Terra. O sistema cobre esse conjunto e
          organiza tudo em três camadas, da mais urgente para a mais consultiva.
        </p>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          <Prioridade
            n="1"
            titulo="O que está errado"
            texto="Alarmes ordenados por gravidade, não por tela. O mais grave sempre aparece primeiro."
          />
          <Prioridade
            n="2"
            titulo="Quanto tempo resta"
            texto="Projeção até o limite. Não basta saber que o oxigênio está em 69%, importa quando acaba."
          />
          <Prioridade
            n="3"
            titulo="O que fazer"
            texto="Ação imediata e link direto para o protocolo. Uma decisão, não um diagnóstico."
          />
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-gelo/70">
          A maior parte do tempo nada está em crise, e o sistema serve para manter a missão dentro
          dos limites: acompanhar consumíveis, planejar rotas, checar o traje antes de sair e
          registrar o que foi decidido. Quando algo foge do controle, essa mesma estrutura vira
          prioridade e prazo.
        </p>

        <div className="mt-3 rounded-lg border border-alerta/25 bg-alerta/8 p-3">
          <p className="text-[12px] leading-relaxed text-gelo/80">
            <span className="font-semibold text-alerta">Regra de ouro:</span> se houver alarme
            crítico, resolva-o antes de qualquer outra coisa. O resto do sistema pode esperar dois
            minutos; um pulmão não espera.
          </p>
        </div>
      </section>

      {/* CÓDIGO DE CORES */}
      <section className="card-glass p-5">
        <h2 className="text-[14px] font-semibold tracking-tight">Como ler as cores e os ícones</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-gelo/70">
          Nenhum estado depende só da cor. Cada um tem também ícone e forma, para funcionar em
          condições de baixa visão, tela suja ou daltonismo.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Estado
            cor="nominal"
            titulo="Nominal"
            icone="círculo com check"
            texto="Dentro do limite. Nenhuma ação necessária."
          />
          <Estado
            cor="atencao"
            titulo="Atenção"
            icone="triângulo"
            texto="Aproximando do limite. Planeje a correção antes de virar crítico."
          />
          <Estado
            cor="critico"
            titulo="Crítico"
            icone="círculo com X"
            texto="Fora do limite. Ação imediata, é o que vem no topo da lista."
          />
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-gelo/60">
          O laranja é a cor da marca, não de status. Ele indica destaque e navegação, nunca perigo,
          assim não compete com o vermelho dos alarmes.
        </p>
      </section>

      {/* AS TELAS */}
      <section>
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h2 className="text-[14px] font-semibold tracking-tight">As telas, por ordem de uso</h2>
            <p className="text-[11.5px] text-gelo/60">
              Da mais urgente para a mais consultiva. As quatro primeiras salvam vidas; o resto
              evita erros.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-gelo/55">
            <ListChecks size={11} /> 10 telas
          </span>
        </div>

        <div className="space-y-2.5">
          {TELAS.map((t) => (
            <article
              key={t.rota}
              className={`card-glass p-4 ${t.critico ? 'card-destaque' : ''}`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] ${
                    t.critico ? 'bg-marte/15 text-marte' : 'bg-black/30 text-gelo/65'
                  }`}
                >
                  {t.n}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3 className="text-[14.5px] font-semibold tracking-tight">{t.nome}</h3>
                    {t.critico && (
                      <span className="rounded border border-marte/35 bg-marte/10 px-1.5 py-0.5 text-[10.5px] uppercase tracking-wider text-marte">
                        essencial
                      </span>
                    )}
                    <Link
                      to={t.rota}
                      className="ml-auto flex shrink-0 items-center gap-1 text-[11.5px] text-gelo/60 transition-colors hover:text-marte"
                    >
                      abrir <ArrowRight size={11} />
                    </Link>
                  </div>

                  <p className="mt-1 text-[12.5px] leading-relaxed text-gelo/75">{t.resumo}</p>

                  <p className="mt-2 text-[12px] leading-relaxed text-gelo/70">
                    <span className="font-medium text-gelo/90">Quando usar: </span>
                    {t.quando}
                  </p>

                  <ul className="mt-2 space-y-1">
                    {t.fazer.map((f) => (
                      <li key={f} className="flex gap-2 text-[12px] leading-relaxed text-gelo/70">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-marte/70" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ATALHOS */}
      <section className="card-glass p-5">
        <div className="flex items-center gap-2">
          <Keyboard size={14} className="text-marte" />
          <h2 className="text-[14px] font-semibold tracking-tight">Atalhos que economizam segundos</h2>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Atalho tecla="Ctrl + K" acao="Busca rápida: protocolo, equipamento, risco ou tela" />
          <Atalho tecla="↑ ↓" acao="Navegar entre os resultados da busca" />
          <Atalho tecla="Enter" acao="Abrir o resultado selecionado" />
          <Atalho tecla="Esc" acao="Fechar a busca" />
          <Atalho tecla="Tab" acao="Percorrer todos os controles pelo teclado" />
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-gelo/60">
          Com 10 telas, procurar no menu custa tempo. Se você sabe o nome do protocolo, a busca
          chega mais rápido do que qualquer navegação.
        </p>
      </section>

      {/* GLOSSÁRIO */}
      <section className="card-glass p-5">
        <h2 className="text-[14px] font-semibold tracking-tight">Glossário</h2>
        <p className="mt-1 text-[11.5px] text-gelo/60">
          As siglas que aparecem nas telas, em linguagem direta.
        </p>
        <dl className="mt-3 divide-y divide-white/5">
          {GLOSSARIO.map((g) => (
            <div key={g.termo} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
              <dt className="w-24 shrink-0 font-mono text-[12px] text-marte">{g.termo}</dt>
              <dd className="text-[12px] leading-relaxed text-gelo/70">{g.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* HONESTIDADE */}
      <section className="card-glass border-alerta/25 p-5">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-alerta" />
          <h2 className="text-[14px] font-semibold tracking-tight">O que é real e o que é simulado</h2>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-gelo/75">
          Esta é uma parte importante: o sistema mistura dados medidos e dados de demonstração, e
          sempre diz qual é qual.
        </p>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg border border-nominal/25 bg-nominal/5 p-3">
            <div className="text-[12px] font-semibold text-nominal">Medido, de fonte NASA</div>
            <ul className="mt-1.5 space-y-1 text-[11.5px] leading-relaxed text-gelo/70">
              <li>
                Clima local de Jezero, ao vivo, pelo feed oficial de meteorologia do Mars 2020
                (MEDA, a bordo do Perseverance).
              </li>
              <li>
                Série histórica de Elysium Planitia, pela NASA Open API (api.nasa.gov), serviço
                InSight Mars Weather.
              </li>
              <li>
                Imagens da cratera, pela NASA Image and Video Library API (images-api.nasa.gov).
              </li>
              <li>
                Instrumentos e coleções científicas, pelo PDS Registry da NASA.
              </li>
              <li>Limites de radiação, pressão e percloratos, de publicações da NASA.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-alerta/25 bg-alerta/5 p-3">
            <div className="text-[12px] font-semibold text-alerta">Simulado, para demonstração</div>
            <ul className="mt-1.5 space-y-1 text-[11.5px] leading-relaxed text-gelo/70">
              <li>Consumíveis do habitat (oxigênio, água, energia, alimento).</li>
              <li>Radiação acumulada e janelas de comunicação.</li>
              <li>Estado do PLSS e posição dos alvos no mapa.</li>
              <li>Toda a tripulação, que é fictícia.</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-gelo/60">
          Nenhum valor simulado deve ser lido como medição. O objetivo é mostrar como o sistema se
          comportaria com dados reais, não afirmar que estes são os dados de hoje.
        </p>
      </section>

      {/* PARA O HACKATHON */}
      <section className="card-glass p-5">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-marte" />
          <h2 className="text-[14px] font-semibold tracking-tight">
            Para quem está avaliando o projeto
          </h2>
        </div>

        <div className="mt-3 space-y-3">
          <Bloco
            titulo="O problema"
            texto="Uma missão humana a Marte precisa manter quatro pessoas vivas por centenas de sóis, num ambiente sem ar respirável, com radiação alta, temperatura muito abaixo de zero e até 24 minutos de atraso na comunicação com a Terra. Sobreviver exige acompanhar recursos, planejar deslocamentos, proteger o traje e decidir sozinho quando algo dá errado. O sistema cobre esse conjunto, com prioridade para a segurança e para as decisões que não podem esperar."
          />
          <Bloco
            titulo="A proposta"
            texto="Um console que conduz o astronauta, em vez de apenas informá-lo. Todos os indicadores convergem para uma única lista: o que está errado, quanto tempo resta e o que fazer. Cada número tem origem rastreável em um instrumento real."
          />
          <Bloco
            titulo="O que o diferencia"
            texto="A maioria dos painéis de missão mostra dados. Este mostra prioridade, prazo e ação, além de registrar as decisões autônomas para auditoria, o que nenhum painel convencional faz."
          />
          <Bloco
            titulo="Base científica"
            texto="O sistema combina dados oficiais da NASA com a API da NASA em tempo de execução. O clima local vem do feed oficial de meteorologia do Mars 2020, medido pelo MEDA no Perseverance. A série histórica vem da NASA Open API, as imagens da NASA Image and Video Library e os instrumentos do PDS Registry. Sobre essa base, aplica o modelo RIDGE de riscos, os limites de radiação do RAD e a literatura de planejamento de trajeto do NTRS, sempre com a fonte declarada."
          />
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="flex items-start gap-2 rounded-lg border border-white/8 bg-black/20 p-3">
        <Radio size={11} className="mt-0.5 shrink-0 text-gelo/60" />
        <p className="text-[11px] leading-relaxed text-gelo/60">
          Sync Six · Guia de Sobrevivência em Marte · cenário atual: {MISSAO.local}, Sol{' '}
          {MISSAO.sol}, {MISSAO.tripulacao} tripulantes. Protótipo demonstrativo do NASA Space Apps
          Challenge. Sem validação operacional.
        </p>
      </footer>
    </div>
  )
}

function Prioridade({ n, titulo, texto }: { n: string; titulo: string; texto: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/25 p-3">
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-marte/15 font-mono text-[11px] text-marte">
          {n}
        </span>
        <span className="text-[12px] font-semibold text-gelo/90">{titulo}</span>
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/65">{texto}</p>
    </div>
  )
}

function Estado({
  cor,
  titulo,
  icone,
  texto,
}: {
  cor: 'nominal' | 'atencao' | 'critico'
  titulo: string
  icone: string
  texto: string
}) {
  const mapa = {
    nominal: { borda: 'card-estado-nominal', texto: 'text-nominal' },
    atencao: { borda: 'card-estado-atencao', texto: 'text-alerta' },
    critico: { borda: 'card-estado-critico', texto: 'text-critico' },
  }[cor]

  return (
    <div className={`rounded-lg border bg-black/20 p-3 ${mapa.borda}`}>
      <div className={`text-[12px] font-semibold ${mapa.texto}`}>{titulo}</div>
      <div className="mt-0.5 text-[11px] text-gelo/55">{icone}</div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-gelo/70">{texto}</p>
    </div>
  )
}

function Atalho({ tecla, acao }: { tecla: string; acao: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded border border-white/8 bg-black/25 px-3 py-2">
      <kbd className="shrink-0 rounded border border-white/15 px-1.5 py-0.5 font-mono text-[11px] text-gelo/80">
        {tecla}
      </kbd>
      <span className="text-[11.5px] leading-relaxed text-gelo/70">{acao}</span>
    </div>
  )
}

function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <h3 className="text-[12.5px] font-semibold text-gelo/90">{titulo}</h3>
      <p className="mt-0.5 text-[12px] leading-relaxed text-gelo/70">{texto}</p>
    </div>
  )
}
