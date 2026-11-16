# Guia de Sobrevivência Interplanetária: Mapa Marciano

**Sync Six · NASA Space Apps Challenge**

Plataforma web interativa que reúne informações para explorar os desafios de navegação,
sobrevivência e pesquisa científica em Marte. O projeto utiliza a Cratera Jezero como
cenário para conectar mapas, recursos, riscos e decisões de uma missão simulada.

A proposta é transformar informações dispersas em uma experiência acessível de
planejamento e aprendizado, considerando a segurança da tripulação e os objetivos
científicos da exploração.

## Projeto no ar

[Acesse o Mapa Marciano](https://hackaton-nasa-five.vercel.app/)

## Funcionalidades

- **Centro de Missão:** visão geral dos recursos do habitat, estimativas de autonomia e alertas.
- **Mapa Marciano:** imagens de Jezero com marcações demonstrativas de alvos científicos e áreas de risco.
- **Planejamento de rotas:** comparação de trajetos predefinidos por duração, consumo de oxigênio, inclinação e valor científico.
- **Sistemas vitais:** representação do suporte à vida no habitat e no traje espacial.
- **Protocolos e checklist de EVA:** procedimentos interativos e verificações para atividades extraveiculares.
- **Simulador de emergências:** cenários com escolhas, consequências e explicações para praticar decisões.
- **Materiais de apoio:** catálogo de equipamentos, exemplos de decisões autônomas e manual de uso.

## Tecnologias

| Tecnologia | Finalidade |
| --- | --- |
| **React** | Construção da interface e dos componentes interativos. |
| **TypeScript** | Desenvolvimento com tipagem estática. |
| **Vite** | Ambiente de desenvolvimento e geração da versão de produção. |
| **Tailwind CSS** | Estilização e identidade visual da aplicação. |
| **React Router** | Navegação entre as telas. |
| **Lucide React** | Ícones da interface. |
| **APIs da NASA** | Consulta a dados e conteúdos científicos. |
| **Vercel** | Hospedagem da aplicação. |

A aplicação executa no navegador, sem backend próprio.

## Executar localmente

Com Node.js e npm instalados, execute na pasta do projeto:

```bash
npm ci
npm run dev
```

Abra no navegador o endereço informado pelo Vite.

Para configurar uma chave da NASA Open API, crie um arquivo `.env.local` conforme
o exemplo em [`.env.example`](.env.example). Sem configuração, a aplicação utiliza
`DEMO_KEY`, sujeita aos limites do serviço.

Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```

## Sobre os dados

O projeto combina imagens e referências científicas da NASA com dados simulados de
recursos, tripulação, trajetos e condições operacionais. Trata-se de um protótipo
demonstrativo para explorar decisões de missão.

Mais detalhes estão na [documentação técnica](DOCUMENTACAO.md).

## Equipe

- [GUILHERME AUGUSTO GOMES ARRIBAMAR](https://www.linkedin.com/in/guilherme-arribamar/)
- [LEONARDO VINICIUS RUIZ RONDELIS](https://www.linkedin.com/in/leonnardoruiz/)
- [MARIA EDUARDA FERNANDES RIBERIRO](https://www.linkedin.com/in/mariafribeiro/)
- [MARIA EDUARDA PEREIRA NUNES](https://www.linkedin.com/in/maria-eduarda-pereira-nunes-ba2a052b8/)
- [MATHEUS COSTA CAETANO PINTO](https://www.linkedin.com/in/matheusccp2/)
- [NICOLAS SILVA PREVIATO](https://www.linkedin.com/in/nicolaspreviato/)
