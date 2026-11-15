import { DICIONARIO } from './i18n/dicionario'

/**
 * Idioma da interface.
 *
 * O português é a fonte: o texto em PT é a própria chave do dicionário.
 * Se uma tradução não existir, o sistema mostra o português em vez de
 * quebrar. Isso permite traduzir por partes sem deixar buracos na tela.
 *
 * O inglês é o padrão de fábrica.
 *
 * `t` é uma função de módulo, não um hook, porque os arquivos de dados
 * (protocolos, equipamentos, riscos) montam suas constantes no carregamento
 * do módulo. Por isso a troca de idioma recarrega a página: assim os dados
 * são remontados no idioma novo, sem precisar reescrever cada módulo.
 */

export type Idioma = 'en' | 'pt'

const CHAVE = 'syncsix.idioma'

function idiomaInicial(): Idioma {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'pt' || salvo === 'en') return salvo
  } catch {
    // Armazenamento bloqueado: segue o padrão de fábrica.
  }
  return 'en'
}

let idiomaAtual: Idioma = idiomaInicial()

export function idioma(): Idioma {
  return idiomaAtual
}

export function definirIdioma(novo: Idioma) {
  if (novo === idiomaAtual) return
  try {
    localStorage.setItem(CHAVE, novo)
  } catch {
    // Sem persistência, a escolha vale só até recarregar.
  }
  idiomaAtual = novo
  // Recarrega para que as constantes de dados sejam remontadas no idioma novo.
  window.location.reload()
}

/**
 * Normaliza números para `{0}`, `{1}`... assim uma frase construída por
 * template literal (`3 itens`) casa com a chave genérica (`{0} itens`).
 */
function normalizar(s: string): { chave: string; valores: string[] } {
  const valores: string[] = []
  const chave = s.replace(/\d+(?:[.,]\d+)?/g, (m) => {
    valores.push(m)
    return `{${valores.length - 1}}`
  })
  return { chave, valores }
}

/** Traduz um texto em português para o idioma atual. */
export function t(pt: string): string {
  if (idiomaAtual === 'pt') return pt

  const direto = DICIONARIO[pt]
  if (direto !== undefined) return direto

  // Frases montadas por template literal: traduz a forma genérica e devolve
  // os números originais nas posições certas.
  const { chave, valores } = normalizar(pt)
  const generico = DICIONARIO[chave]
  if (generico === undefined) return pt

  return generico.replace(/\{(\d+)\}/g, (_, i) => valores[Number(i)] ?? `{${i}}`)
}

/** Traduz e interpola valores: `tt('{n} itens', { n: 3 })`. */
export function tt(pt: string, valores: Record<string, string | number>): string {
  // Aceita tanto {nome} quanto {0}, para casar com as duas formas do dicionário.
  const nomeados = Object.values(valores)
  const resolvido = t(pt)
  let i = 0
  return resolvido.replace(/\{(\w+)\}/g, (_, k) => {
    if (k in valores) return String(valores[k])
    const porIndice = /^\d+$/.test(k) ? Number(k) : i++
    return String(nomeados[porIndice] ?? `{${k}}`)
  })
}
