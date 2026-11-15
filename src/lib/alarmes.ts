/**
 * Central de alarmes.
 *
 * O sistema tem dados em 11 telas. Um astronauta em emergência não tem tempo
 * de visitar 11 telas. Este módulo deriva, de todas as fontes, a lista única
 * do que está errado, quanto tempo resta e o que fazer.
 *
 * A projeção de tempo é o núcleo: "O₂ em 69%" não diz nada. "O₂ acaba em 128
 * sóis, crítico em 40" diz o que fazer e quando.
 */

import { CONSUMIVEIS, diasRestantes, estadoConsumivel, type Consumivel } from './mission'
import { RIDGE, type Estado } from './ridge'
import { ATMOSFERA, avaliarGas, RESIDUOS, avaliarResiduo } from './atmosfera'
import { autonomiaEva, estadoTraje, PLSS } from './traje'
import { avaliarFrio, CADEIA_FRIO } from './cadeiaFrio'
import { avaliarZona, ZONAS } from './contaminacao'
import { ESTADO_SOLAR } from './abrigo'
import { t, tt } from './i18n'

export type Severidade = 'critico' | 'atencao' | 'nominal'

export type Alarme = {
  id: string
  severidade: Severidade
  /** Origem: qual sistema detectou. */
  origem: string
  titulo: string
  /** O que está acontecendo, em uma frase. */
  detalhe: string
  /** Quanto tempo até o problema se tornar irreversível. */
  tempoRestante?: string
  /** Ação imediata, em uma frase imperativa. */
  acao: string
  /** Protocolo relacionado. */
  protocolo?: string
  /** Tela onde o detalhe completo está. */
  tela?: string
  /** Equipamento que detectou. */
  equipamento?: string
}

/** Converte dias restantes em texto de urgência. */
function projetarConsumivel(c: Consumivel): string {
  const dias = diasRestantes(c)
  if (dias <= 0) return t('esgotado')
  return tt('{n} sóis', { n: dias })
}

/** Deriva todos os alarmes ativos do estado do sistema. */
export function derivarAlarmes(): Alarme[] {
  const lista: Alarme[] = []

  // 1. Consumíveis do habitat
  for (const c of CONSUMIVEIS) {
    const e = estadoConsumivel(c)
    if (e === 'nominal') continue
    lista.push({
      id: `consumivel-${c.id}`,
      severidade: e === 'critico' ? 'critico' : 'atencao',
      origem: t('Habitat'),
      titulo: tt('{nome} em {pct}%', {
        nome: c.nome,
        pct: Math.round((c.atual / c.capacidade) * 100),
      }),
      detalhe: tt('Restam {atual} {unidade} de {capacidade}. Consumo de {consumo} {unidade}/sol.', {
        atual: c.atual,
        unidade: c.unidade,
        capacidade: c.capacidade,
        consumo: c.consumoPorSol,
      }),
      tempoRestante: projetarConsumivel(c),
      acao:
        e === 'critico'
          ? tt('Racionar {nome} imediatamente e reportar à Terra.', {
              nome: c.nome.toLowerCase(),
            })
          : tt('Planejar reposição de {nome}.', { nome: c.nome.toLowerCase() }),
      tela: '/',
    })
  }

  // 2. Categorias RIDGE
  for (const r of RIDGE) {
    if (r.estado === 'nominal') continue
    lista.push({
      id: `ridge-${r.id}`,
      severidade: r.estado,
      origem: tt('RIDGE {letra}', { letra: r.letra }),
      titulo: tt('{nome} em {nivel}', {
        nome: r.nome,
        nivel: r.estado === 'critico' ? t('nível crítico') : t('atenção'),
      }),
      detalhe: r.risco,
      acao: r.resposta,
      protocolo: r.protocolo,
      tela: '/sobrevivencia',
    })
  }

  // 3. Atmosfera
  for (const g of ATMOSFERA) {
    const e = avaliarGas(g)
    if (e === 'nominal') continue
    lista.push({
      id: `gas-${g.id}`,
      severidade: e,
      origem: t('Atmosfera'),
      titulo: tt('{nome} fora da faixa: {valor} {unidade}', {
        nome: g.nome,
        valor: g.valor,
        unidade: g.unidade,
      }),
      detalhe: g.efeito,
      acao:
        g.id === 'co2'
          ? t('Verificar o CDRA e aumentar a ventilação.')
          : g.id === 'o2'
            ? t('Ativar o gerador redundante de oxigênio.')
            : t('Verificar o sistema de controle correspondente.'),
      tela: '/sistemas',
      equipamento: g.sistema,
    })
  }

  // 4. Resíduos e voláteis
  for (const r of RESIDUOS) {
    const e = avaliarResiduo(r)
    if (e === 'nominal') continue
    lista.push({
      id: `residuo-${r.id}`,
      severidade: e,
      origem: t('Ciclo do ar'),
      titulo: tt('{nome}: {valor} {unidade}', {
        nome: r.nome,
        valor: r.valor,
        unidade: r.unidade,
      }),
      detalhe: r.efeito,
      acao: tt('Verificar {sistema}.', { sistema: r.sistema }),
      tela: '/sistemas',
      equipamento: r.sistema,
    })
  }

  // 5. Traje (PLSS)
  for (const c of PLSS) {
    const e = estadoTraje(c)
    if (e === 'nominal') continue
    lista.push({
      id: `plss-${c.id}`,
      severidade: e,
      origem: t('Traje'),
      titulo: tt('{nome} do traje em {pct}%', { nome: c.nome, pct: c.atual }),
      detalhe: c.consequencia,
      tempoRestante: tt('{h} h até o limite', {
        h: ((c.atual - c.limiteRetorno) / c.taxaHora).toFixed(1),
      }),
      acao: t('Iniciar retorno ao habitat.'),
      tela: '/sistemas',
      equipamento: 'PLSS',
    })
  }

  // 6. Cadeia de frio
  for (const i of CADEIA_FRIO) {
    const e = avaliarFrio(i)
    if (e === 'nominal') continue
    lista.push({
      id: `frio-${i.id}`,
      severidade: e,
      origem: t('Cadeia de frio'),
      titulo: tt('{nome} em {temp} °C', { nome: i.nome, temp: i.temperatura }),
      detalhe: i.nota,
      acao:
        e === 'critico'
          ? t('Verificar o freezer e isolar o item afetado.')
          : t('Monitorar de perto; excursões próximas do limite.'),
      tela: '/sistemas',
      equipamento: t('Freezer científico'),
    })
  }

  // 7. Contaminação
  for (const z of ZONAS) {
    const e = avaliarZona(z)
    if (e === 'nominal') continue
    lista.push({
      id: `contaminacao-${z.id}`,
      severidade: e,
      origem: t('Contaminação'),
      titulo: tt('{nome}: {nivel} contra limite {limite}', {
        nome: z.nome,
        nivel: z.nivel,
        limite: z.limite,
      }),
      detalhe: z.descricao,
      acao: z.acao,
      tela: '/sistemas',
      equipamento: z.equipamento,
    })
  }

  // 8. Evento solar
  if (ESTADO_SOLAR.nivel !== 'quieto') {
    lista.push({
      id: 'solar',
      severidade: ESTADO_SOLAR.nivel === 'evento' ? 'critico' : 'atencao',
      origem: t('Radiação'),
      titulo:
        ESTADO_SOLAR.nivel === 'evento'
          ? t('Evento solar em curso')
          : t('Alerta de evento solar'),
      detalhe: tt('{origem}. Dose de pico estimada em {dose} mSv/sol.', {
        origem: ESTADO_SOLAR.origem,
        dose: ESTADO_SOLAR.dosePico,
      }),
      tempoRestante: tt('{min} min até o pico', { min: ESTADO_SOLAR.tempoAtePicoMin }),
      acao:
        ESTADO_SOLAR.nivel === 'evento'
          ? t('Entrar no abrigo imediatamente.')
          : t('Suspender EVA e manter abrigo a menos de 15 min.'),
      tela: '/sistemas',
      equipamento: 'RDS',
    })
  }

  // Ordena: crítico primeiro, depois atenção
  const peso: Record<Severidade, number> = { critico: 0, atencao: 1, nominal: 2 }
  return lista.sort((a, b) => peso[a.severidade] - peso[b.severidade])
}

/** Resumo para o cabeçalho. */
export function resumoAlarmes(alarmes: Alarme[]) {
  return {
    criticos: alarmes.filter((a) => a.severidade === 'critico').length,
    atencao: alarmes.filter((a) => a.severidade === 'atencao').length,
    total: alarmes.length,
  }
}

/** O alarme mais urgente — o que o astronauta deve ver primeiro. */
export function alarmePrioritario(alarmes: Alarme[]): Alarme | undefined {
  return alarmes.find((a) => a.severidade === 'critico') ?? alarmes[0]
}

/** Autonomia da EVA, para o cabeçalho. */
export function autonomiaAtual() {
  return autonomiaEva()
}

export type { Estado }
