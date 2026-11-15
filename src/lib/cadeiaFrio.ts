/**
 * Cadeia de frio: medicamentos e amostras.
 *
 * Diferente da temperatura ambiente: o que importa é a temperatura do
 * armazenamento, que precisa ficar numa faixa estreita. Ciclos térmicos
 * degradam medicamentos e contaminam resultados científicos.
 *
 * Valores SIMULADOS.
 */

export type ItemFrio = {
  id: string
  nome: string
  categoria: 'medicamento' | 'amostra' | 'biológico'
  temperatura: number
  faixaMin: number
  faixaMax: number
  /** Excursões térmicas registradas no ciclo. */
  excursões: number
  /** Limite de excursões antes de descartar. */
  limiteExcursões: number
  validadeSol: number
  nota: string
}

export const CADEIA_FRIO: ItemFrio[] = [
  {
    id: 'insulina',
    nome: 'Insulina e anestésicos',
    categoria: 'medicamento',
    temperatura: 5,
    faixaMin: 2,
    faixaMax: 8,
    excursões: 2,
    limiteExcursões: 4,
    validadeSol: 120,
    nota: 'Degrada rapidamente fora da faixa e perde eficácia sem sinal visível.',
  },
  {
    id: 'amostras',
    nome: 'Amostras de retorno',
    categoria: 'amostra',
    temperatura: -18,
    faixaMin: -25,
    faixaMax: -15,
    excursões: 1,
    limiteExcursões: 3,
    validadeSol: 400,
    nota: 'Excursão térmica pode invalidar a cadeia de custódia científica.',
  },
  {
    id: 'reagentes',
    nome: 'Reagentes de análise',
    categoria: 'biológico',
    temperatura: 4,
    faixaMin: 2,
    faixaMax: 10,
    excursões: 3,
    limiteExcursões: 4,
    validadeSol: 90,
    nota: 'Reagentes degradados produzem resultado falso-negativo nos testes.',
  },
  {
    id: 'plasma',
    nome: 'Plasma e hemoderivados',
    categoria: 'medicamento',
    temperatura: -30,
    faixaMin: -35,
    faixaMax: -25,
    excursões: 0,
    limiteExcursões: 2,
    validadeSol: 180,
    nota: 'Essencial em emergência cirúrgica; não há substituto em Marte.',
  },
]

export type EstadoFrio = 'nominal' | 'atencao' | 'critico'

export function avaliarFrio(i: ItemFrio): EstadoFrio {
  const foraDaFaixa = i.temperatura < i.faixaMin || i.temperatura > i.faixaMax
  const excursaoAlta = i.excursões >= i.limiteExcursões

  if (foraDaFaixa || excursaoAlta) return 'critico'
  if (i.excursões >= i.limiteExcursões - 1) return 'atencao'
  return 'nominal'
}

/** Quantas excursões restam antes do descarte. */
export function margemTermica(i: ItemFrio): number {
  return Math.max(0, i.limiteExcursões - i.excursões)
}
