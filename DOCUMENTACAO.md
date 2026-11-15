# Sync Six: base científica, dados e tecnologia

Documento de referência do projeto **Sync Six, Guia de Sobrevivência em Marte**, desenvolvido para o NASA Space Apps Challenge.

---

## 1. Como o sistema roda offline

Em Marte não há internet, e a comunicação com a Terra leva de 4 a 24 minutos em cada sentido. O console foi desenhado para funcionar **sem nenhuma conexão externa**.

### 1.1 Arquitetura offline

O console é uma aplicação web estática. Depois de compilada, ela é apenas um conjunto de arquivos HTML, CSS e JavaScript, sem servidor de banco de dados, sem autenticação remota e sem dependência de serviços de terceiros.

Na operação, esses arquivos ficam em um computador local dentro do habitat e são servidos por um servidor estático mínimo, rodando na própria máquina. Um tripulante abre o console no navegador do painel da cabine, do tablet de campo ou do visor do traje. Nenhum pacote sai para a rede.

O mesmo conjunto de arquivos pode ser empacotado como aplicativo instalável, o que permite abrir o console sem navegador e sem nenhum processo de servidor.

### 1.2 Onde os dados vivos entram

Os únicos dados que o console consome em execução vêm dos equipamentos da própria missão, pela rede interna do habitat:

| Origem | O que fornece | Meio |
| --- | --- | --- |
| ECLSS | Oxigênio, água, energia, pressão, temperatura interna | Barramento de telemetria do habitat |
| PLSS do traje | Oxigênio, remoção de CO₂, água, bateria | Enlace de rádio de curto alcance |
| Estação meteorológica | Temperatura, pressão, vento, opacidade de poeira | Sensores externos do habitat |
| Sensores de radiação | Dose acumulada, taxa instantânea | Dosímetros da cabine e do traje |
| Rover e equipamentos de campo | Posição, estado, dados de amostra | Enlace local com o rover |

Esses enlaces são locais. Não passam pela Terra e não dependem dela.

Os dados de referência científica não são consultados em tempo de execução. Eles foram capturados durante o desenvolvimento e ficam embutidos no próprio pacote da aplicação: a climatologia de Jezero medida pelo MEDA, a série histórica do InSight, as imagens da cratera e o catálogo de instrumentos do PDS. O console mostra dados reais e rastreáveis da NASA sem precisar de rede.

---

## 2. Base científica

### 2.1 Modelo RIDGE

A NASA organiza os perigos das missões humanas em cinco categorias, conhecidas pela sigla RIDGE:

| Letra | Categoria | Por que importa em Marte |
| --- | --- | --- |
| **R** | Radiation (Radiação) | Sem campo magnético global e com atmosfera fina, a superfície recebe cerca de 0,67 mSv por sol. É o fator que limita a duração da missão. |
| **I** | Isolation and confinement (Isolamento) | Convivência restrita por centenas de sóis, com comunicação assíncrona e sem retorno possível. |
| **D** | Distance from Earth (Distância) | De 4 a 24 minutos de atraso por sentido. Não existe ajuda em tempo real nem evacuação. |
| **G** | Gravity (Gravidade) | 0,38 g. Perda de massa óssea e muscular, com protocolos de exercício obrigatórios. |
| **E** | Environments (Ambientes) | Pressão de 0,6 kPa, atmosfera quase toda de CO₂, temperaturas de -125 °C a 20 °C, poeira perclorada e tempestades. |

O sistema usa essas cinco categorias como estrutura de navegação e de priorização. Elas cobrem o risco ambiental, o biológico, o psicológico e o operacional, não apenas o clima.

### 2.2 Ordenação por letalidade

Cada risco tem um tempo até dano irreversível. O sistema ordena os riscos por esse tempo, do menor para o maior, porque a ordem de leitura em uma emergência não pode ser alfabética nem por menu.

| Faixa | Escala | Exemplo |
| --- | --- | --- |
| Segundos | Dano imediato | Descompressão, falta de oxigênio |
| Minutos | Janela curta | Incêndio, evento de partícula solar |
| Horas | Um turno | Falha de remoção de CO₂, bateria do traje |
| Sóis | Dias marcianos | Consumíveis, cadeia de frio |
| Anos | Carreira | Dose acumulada de radiação |

### 2.3 Limites físicos usados

| Grandeza | Valor | Origem |
| --- | --- | --- |
| Pressão atmosférica em Jezero | 0,6 a 0,9 kPa | MEDA |
| Temperatura em Jezero | -125 °C a 20 °C | MEDA |
| Dose de radiação de superfície | 0,67 mSv/sol | RAD, no Curiosity |
| Limite de carreira para astronauta | 1.000 mSv | NASA STD-3001 |
| Gravidade de superfície | 0,38 g | NASA Mars Facts |
| Percloratos no solo | 0,5 a 1% em massa | Phoenix, instrumento WCL |
| Composição atmosférica | 95,1% CO₂, 2,6% N₂, 1,9% Ar, 0,16% O₂ | MEDA e SAM |
| Dia solar marciano | 24 h 39 min 35 s | Definição astronômica |

### 2.4 Cálculos que o sistema faz

**Autonomia do traje.** O PLSS tem quatro consumíveis: oxigênio, remoção de CO₂, água e bateria. A autonomia é o menor dos quatro, não a média. No protótipo, o CO₂ é o limitante, com cerca de 4 horas.

**Limite de caminhada de volta.** Se o veículo falhar, o astronauta precisa voltar a pé. A distância máxima é metade da autonomia restante, com 20% de margem de segurança, multiplicada pela velocidade de caminhada no traje:

```
limite = (horas restantes × 0,8 / 2) × 1,6 km/h
```

Com 3,2 horas restantes, o limite é de 2,6 km.

**Abrigo solar.** Um evento de partícula solar exige abrigo em minutos. O sistema compara o tempo até o pico do evento com o tempo de deslocamento até cada abrigo disponível, e exige margem superior a 15 minutos. Sem margem, o deslocamento não é autorizado.

**Consumíveis.** Cada consumível tem taxa de consumo por tripulante por sol. O tempo restante é o estoque dividido pelo consumo diário, e não uma porcentagem do tanque.

### 2.5 Planejamento de trajeto

O sistema segue a prática da NASA para planejamento de travessia: waypoints intermediários, rota alternativa obrigatória, limite de caminhada de volta, e escolha por consumo de oxigênio e não apenas por distância. As rotas do protótipo têm waypoints com elevação, declividade e estado de comunicação.

---

## 3. Dados e APIs da NASA

O projeto usa quatro fontes oficiais da NASA. Três são consumidas por API e uma é um feed público.

| Fonte | Endereço | O que fornece | Uso no sistema |
| --- | --- | --- | --- |
| **Mars 2020 Weather Feed** | `mars.nasa.gov/rss/api/?feed=weather&category=mars2020` | Temperatura, pressão e estação medidos pelo MEDA, no Perseverance, em Jezero | Clima local da missão |
| **NASA Open API, InSight** | `api.nasa.gov/insight_weather/` | Temperatura, vento, pressão e estação em Elysium Planitia | Série histórica de outro ponto de Marte |
| **NASA Image and Video Library** | `images-api.nasa.gov/search` | Imagens de Jezero em alta resolução | Mapa base da tela de Exploração |
| **PDS Registry** | `pds.nasa.gov` | Catálogo de instrumentos e coleções científicas | Rastreabilidade dos equipamentos |

### 3.1 Rastreabilidade

Todo indicador exibido tem origem declarada. A tela de Equipamentos percorre a cadeia completa, do instrumento físico ao número na tela:

```
grandeza medida → instrumento → plataforma → valor exibido
```

Exemplo: radiação de superfície → RAD → Curiosity (MSL) → dose acumulada e taxa instantânea.

Os 27 instrumentos catalogados incluem MEDA, REMS, RAD, RDS, DAN, RIMFAX, SHERLOC, WATSON, MOXIE, ARED e DXA, entre outros.

### 3.2 O que é simulado

A honestidade sobre a origem dos dados é parte do projeto. Os valores a seguir são simulados e estão identificados como tal na interface:

- Consumíveis do habitat: oxigênio, água, energia e alimento.
- Dose de radiação acumulada e janelas de comunicação.
- Estado do PLSS durante a EVA.
- Posição dos alvos científicos no mapa.
- A tripulação, que é fictícia.

Nenhum valor simulado é apresentado como medição.

---

## 4. Tecnologias

### 4.1 Aplicação

| Camada | Tecnologia | Motivo da escolha |
| --- | --- | --- |
| Interface | React 19 | Componentização e atualização de estado sem recarregar |
| Linguagem | TypeScript | Tipagem estática, que evita uma classe inteira de erros em código que lida com unidades e limites |
| Build | Vite | Compilação rápida e saída estática, que é o que permite rodar offline |
| Estilo | Tailwind CSS 4 | Tokens de tema centralizados, o que mantém cores e espaçamento consistentes |
| Rotas | React Router | Navegação entre módulos sem servidor |
| Ícones | lucide-react | Ícones vetoriais leves, com significado consistente |

### 4.2 Estrutura

```
src/
  lib/          dados, cálculos e regras de domínio
  components/   componentes reutilizáveis
  pages/        11 telas da aplicação
  index.css     tokens de tema e utilitários
```

---

## 5. Referências

- NASA, *Human Research Program*, modelo de riscos RIDGE.
- NASA STD-3001, *NASA Space Flight Human-System Standard*, limites de exposição à radiação.
- NASA JPL, *Mars 2020 Perseverance*, instrumento MEDA.
- NASA JPL, *InSight Mars Weather Service*.
- NASA JPL, *Curiosity*, instrumento RAD.
- NASA Phoenix Mars Lander, instrumento WCL, percloratos no solo.
- NASA PDS, *Planetary Data System Registry*.
- NASA NTRS, literatura de planejamento de travessia e *walkback* para EVA planetária.
- NASA Image and Video Library.
