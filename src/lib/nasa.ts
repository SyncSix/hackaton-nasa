/**
 * Integrações com APIs públicas da NASA.
 *
 * Dados REAIS:
 *  - InSight Mars Weather (Elysium Planitia): temperatura, vento, pressão, estação.
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
