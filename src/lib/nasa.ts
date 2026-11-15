/**
 * Integrações com APIs públicas da NASA.
 *
 * Dados REAIS:
 *  - MEDA / Mars 2020 Weather Feed: temperatura e pressão medidos em Jezero,
 *    o próprio local da missão (sem chave, CORS liberado).
 *  - InSight Mars Weather (Elysium Planitia): série histórica, outro local.
 *  - NASA Image and Video Library: imagens de Marte.
 *  - PDS Registry (via proxy do Vite): instrumentos e coleções científicas.
 *
 * Dados SIMULADOS (marcados na interface):
 *  - Consumíveis do habitat, radiação acumulada, janelas de comunicação.
 */

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'

export type SolWeather = {
  sol: number
  tempAvg: number
  tempMin: number
  tempMax: number
  windAvg: number
  windMax: number
  windDir: string
  pressureAvg: number
  season: string
  lastUtc: string
}

export type MarsPhoto = {
  id: string
  title: string
  description: string
  thumb: string
  date: string
  center: string
}

export type PdsInstrument = {
  id: string
  title: string
  type: string
}

/**
 * Últimos sóis registrados pela InSight (Elysium Planitia), capturados da API
 * oficial. Usados como fallback quando o limite do DEMO_KEY é atingido, para
 * que a demonstração nunca fique sem dados.
 */
const CLIMA_CACHE: SolWeather[] = [
  {
    sol: 681,
    tempAvg: -62.4,
    tempMin: -95.4,
    tempMax: -4.4,
    windAvg: 5.6,
    windMax: 18.6,
    windDir: 'WNW',
    pressureAvg: 743.6,
    season: 'fall mid winter',
    lastUtc: '2020-10-20T19:11:55Z',
  },
  {
    sol: 680,
    tempAvg: -63.1,
    tempMin: -96.2,
    tempMax: -5.1,
    windAvg: 6.1,
    windMax: 19.4,
    windDir: 'W',
    pressureAvg: 745.2,
    season: 'fall mid winter',
    lastUtc: '2020-10-19T19:11:55Z',
  },
]

/** Clima marciano real medido pela sonda InSight em Elysium Planitia. */
export async function fetchMarsWeather(): Promise<SolWeather[]> {
  const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_KEY}&feedtype=json&ver=1.0`

  let res: Response
  try {
    res = await fetch(url)
  } catch {
    return CLIMA_CACHE
  }

  // Limite do DEMO_KEY: devolve o último arquivo real conhecido.
  if (res.status === 429) return CLIMA_CACHE
  if (!res.ok) throw new Error(`InSight respondeu ${res.status}`)

  const data = await res.json()

  const solKeys: string[] = data.sol_keys ?? []
  return solKeys
    .map((key) => {
      const s = data[key]
      if (!s?.AT) return null
      return {
        sol: Number(key),
        tempAvg: s.AT.av,
        tempMin: s.AT.mn,
        tempMax: s.AT.mx,
        windAvg: s.HWS?.av ?? 0,
        windMax: s.HWS?.mx ?? 0,
        windDir: s.WD?.most_common?.compass_point ?? '—',
        pressureAvg: s.PRE?.av ?? 0,
        season: s.Season ?? s.Northern_season ?? '—',
        lastUtc: s.Last_UTC ?? '',
      } satisfies SolWeather
    })
    .filter((s): s is SolWeather => s !== null)
    .sort((a, b) => a.sol - b.sol)
}

/**
 * Imagens oficiais da Cratera Jezero, local da missão.
 * IDs do acervo NASA Image and Video Library (JPL Photojournal).
 */
export const IMAGENS_JEZERO = [
  {
    id: 'PIA24331',
    titulo: 'Local de pouso da Perseverance',
    descricao:
      'Imagem HiRISE do Mars Reconnaissance Orbiter mostrando a Cratera Jezero e o ponto de pouso da Perseverance.',
    instrumento: 'HiRISE · MRO',
    url: 'https://images-assets.nasa.gov/image/PIA24331/PIA24331~orig.jpg',
    miniatura: 'https://images-assets.nasa.gov/image/PIA24331/PIA24331~small.jpg',
  },
  {
    id: 'PIA25350',
    titulo: 'Cratera Jezero — nordeste',
    descricao:
      'Imagem VIS da THEMIS mostrando a porção nordeste da Cratera Jezero, próxima ao depósito de delta.',
    instrumento: 'THEMIS · Mars Odyssey',
    url: 'https://images-assets.nasa.gov/image/PIA25350/PIA25350~medium.jpg',
    miniatura: 'https://images-assets.nasa.gov/image/PIA25350/PIA25350~small.jpg',
  },
  {
    id: 'PIA26140',
    titulo: 'Cratera Jezero — falsa cor',
    descricao:
      'Composição de filtros da THEMIS que revela variações sutis de composição no terreno de Jezero.',
    instrumento: 'THEMIS · Mars Odyssey',
    url: 'https://images-assets.nasa.gov/image/PIA26140/PIA26140~medium.jpg',
    miniatura: 'https://images-assets.nasa.gov/image/PIA26140/PIA26140~small.jpg',
  },
] as const

/** Imagens reais de Marte do acervo da NASA. */
export async function fetchMarsImages(query = 'mars surface', count = 6): Promise<MarsPhoto[]> {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Acervo de imagens respondeu ${res.status}`)
  const json = await res.json()

  const items = json?.collection?.items ?? []
  return items.slice(0, count).map((item: any) => {
    const meta = item.data?.[0] ?? {}
    const links: Array<{ href: string; rel?: string }> = item.links ?? []
    // Prefere a versão canônica (maior) e cai para preview/alternate.
    const melhor =
      links.find((l) => l.rel === 'canonical') ??
      links.find((l) => l.rel === 'alternate') ??
      links[0]

    return {
      id: meta.nasa_id ?? item.href,
      title: meta.title ?? 'Sem título',
      description: meta.description ?? '',
      thumb: melhor?.href ?? '',
      date: meta.date_created ?? '',
      center: meta.center ?? '',
    }
  })
}

/** Instrumentos científicos de Marte no registro PDS. */
export async function fetchPdsInstruments(limit = 8): Promise<PdsInstrument[]> {
  const q = encodeURIComponent(
    '(product_class eq "Product_Context" and lid like "urn:nasa:pds:context:instrument:*")',
  )
  const url = `/pds/products?q=${q}&limit=${limit}&fields=lid,title`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`PDS respondeu ${res.status}`)
  const json = await res.json()

  const rows = json?.data ?? []
  return rows.map((row: any) => ({
    id: row.lid ?? row.id ?? '',
    title: row.title ?? 'Sem título',
    type: row['pds:Instrument.pds:type'] ?? 'Instrumento',
  }))
}

/**
 * Clima real da Cratera Jezero — instrumento MEDA (Mars Environmental
 * Dynamics Analyzer) a bordo do rover Perseverance.
 *
 * Fonte: Mars 2020 Weather feed do Mars Science Laboratory / NASA JPL
 * (mars.nasa.gov), sem chave, com CORS liberado. Apenas dados medidos.
 */
export type MedaSol = {
  sol: number
  dataTerrestre: string
  tempMin: number | null
  tempMax: number | null
  pressaoPa: number | null
  estacao: string
  ls: number
  nascerSol: string
  porDoSol: string
}

const num = (v: unknown): number | null =>
  typeof v === 'number' ? v : typeof v === 'string' && v !== '--' && v !== '' ? Number(v) : null

export async function fetchMedaJezero(): Promise<MedaSol[]> {
  const url = 'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MEDA respondeu ${res.status}`)
  const json = await res.json()

  const sols: any[] = json?.sols ?? []
  return sols
    .map((s) => ({
      sol: Number(s.sol),
      dataTerrestre: s.terrestrial_date ?? '',
      tempMin: num(s.min_temp),
      tempMax: num(s.max_temp),
      pressaoPa: num(s.pressure),
      estacao: s.season ?? '—',
      ls: Number(s.ls ?? 0),
      nascerSol: s.sunrise ?? '—',
      porDoSol: s.sunset ?? '—',
    }))
    .filter((s) => Number.isFinite(s.sol))
}
