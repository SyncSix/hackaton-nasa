# Mars Survival Guide

MVP de um sistema de guia de sobrevivência interplanetária em Marte, construído para hackathon.

Astronautas usam o sistema para acompanhar consumíveis críticos, avaliar janelas de
atividade extraveicular (EVA) e consultar o contexto científico do ambiente marciano
com dados da NASA.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Estilo:** Tailwind CSS
- **Dados científicos:** NASA PDS via MCP (`pds-registry`) e NASA Open APIs
- **Estado:** client-side, sem backend no MVP

## Status

Em construção. Ver `docs/` para escopo e decisões de arquitetura.

## Escopo do MVP

O sistema tem três painéis:

1. **Consumíveis** — oxigênio, água, energia e alimento com projeções e alertas.
2. **Janela EVA** — condições para saída segura.
3. **Contexto científico** — radiação, poeira e instrumentos vindos do PDS.

## Aviso sobre a origem dos dados

O NASA PDS é um catálogo de **dados científicos** (quem mediu o quê, onde, com qual
instrumento). Ele **não** fornece telemetria de habitat, níveis de consumíveis nem
clima operacional em tempo real.

Por isso:

- **Dados reais:** contexto científico do ambiente marciano (instrumentos, missões,
  coleções e produtos do PDS) e imagens/conteúdo das NASA Open APIs.
- **Dados simulados:** consumíveis, taxas de consumo e estado do habitat. São
  **valores de demonstração**, sempre marcados como tal na interface.

Nenhum número operacional deste MVP deve ser lido como dado real de missão.
