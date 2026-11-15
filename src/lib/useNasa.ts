import { useEffect, useState } from 'react'
import {
  fetchMarsImages,
  fetchMarsWeather,
  fetchMedaJezero,
  fetchPdsInstruments,
  type MedaSol,
  type MarsPhoto,
  type PdsInstrument,
  type SolWeather,
} from './nasa'

type Estado<T> = { data: T | null; erro: string | null; carregando: boolean }

function useRecurso<T>(carregar: () => Promise<T>, deps: unknown[] = []): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({
    data: null,
    erro: null,
    carregando: true,
  })

  useEffect(() => {
    let ativo = true
    setEstado({ data: null, erro: null, carregando: true })

    carregar()
      .then((data) => {
        if (ativo) setEstado({ data, erro: null, carregando: false })
      })
      .catch((e: unknown) => {
        if (ativo) {
          setEstado({
            data: null,
            erro: e instanceof Error ? e.message : 'Falha ao carregar',
            carregando: false,
          })
        }
      })

    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return estado
}

export function useMarsWeather() {
  return useRecurso<SolWeather[]>(fetchMarsWeather)
}

export function useMarsImages(query?: string) {
  return useRecurso<MarsPhoto[]>(() => fetchMarsImages(query), [query])
}

/**
 * Clima real de Jezero, medido pelo MEDA no Perseverance.
 * Este é o dado local da missão — o InSight fica apenas como série histórica.
 */
export function useMedaJezero() {
  return useRecurso<MedaSol[]>(fetchMedaJezero)
}

export function usePdsInstruments() {
  return useRecurso<PdsInstrument[]>(fetchPdsInstruments)
}
