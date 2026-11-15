/**
 * Instrumentos e equipamentos reais da NASA que alimentam o sistema.
 *
 * Cada indicador exibido na interface vem de um equipamento. Esta é a
 * rastreabilidade: grandeza medida → instrumento → missão → o que ele mede.
 *
 * Fontes: NASA Science (Perseverance, Curiosity), JPL Photojournal,
 * NASA ECLSS Reference.
 */

import { t } from './i18n'

export type Equipamento = {
  id: string
  nome: string
  /** Sigla completa, quando houver. */
  completo?: string
  /** O que ele mede. */
  mede: string
  /** Unidade principal que retorna. */
  unidade: string
  /** Missão ou sistema onde opera. */
  plataforma: string
  /** Categoria RIDGE relacionada. */
  ridge: string
  /** Observação sobre uso no protótipo. */
  nota?: string
}

export const EQUIPAMENTOS: Record<string, Equipamento> = {
  RAD: {
    id: 'RAD',
    nome: 'RAD',
    completo: 'Radiation Assessment Detector',
    mede: t('Prótons, íons energéticos, nêutrons e raios gama na superfície'),
    unidade: t('mGy/dia · dose acumulada'),
    plataforma: t('MSL Curiosity'),
    ridge: 'R',
    nota: t('Base dos limites de blindagem para missões humanas.'),
  },
  RDS: {
    id: 'RDS',
    nome: 'RDS',
    completo: 'Radiation and Dust Sensor',
    mede: t('Radiação e quantidade e tamanho de partículas de poeira'),
    unidade: t('contagem/s · opacidade τ'),
    plataforma: t('MEDA · Perseverance'),
    ridge: 'R',
  },
  MEDA: {
    id: 'MEDA',
    nome: 'MEDA',
    completo: 'Mars Environmental Dynamics Analyzer',
    mede: t('Vento, temperatura, pressão, umidade e poeira'),
    unidade: t('m/s · °C · Pa · % · τ'),
    plataforma: t('Perseverance'),
    ridge: 'E',
    nota: t('Estação meteorológica completa. Cinco sensores distintos.'),
  },
  REMS: {
    id: 'REMS',
    nome: 'REMS',
    completo: 'Rover Environmental Monitoring Station',
    mede: t('Pressão, temperatura do ar e do solo, umidade, vento e UV'),
    unidade: t('Pa · °C · % · m/s · UV'),
    plataforma: t('MSL Curiosity'),
    ridge: 'E',
    nota: t('Registra 5 min a cada hora, 1 Hz, por sol.'),
  },
  DAN: {
    id: 'DAN',
    nome: 'DAN',
    completo: 'Dynamic Albedo of Neutrons',
    mede: t('Hidrogênio no subsolo, indicando água ou gelo'),
    unidade: t('% de água até 1 m de profundidade'),
    plataforma: t('MSL Curiosity'),
    ridge: 'E',
    nota: t('Detecta água a partir de 0,1%.'),
  },
  RIMFAX: {
    id: 'RIMFAX',
    nome: 'RIMFAX',
    completo: "Radar Imager for Mars' Subsurface Experiment",
    mede: t('Estruturas geológicas subterrâneas'),
    unidade: t('perfil de radar · 15–30 cm de resolução'),
    plataforma: t('Perseverance'),
    ridge: 'E',
    nota: t('Penetra mais de 9 m no subsolo.'),
  },
  MOXIE: {
    id: 'MOXIE',
    nome: 'MOXIE',
    completo: 'Mars Oxygen In-Situ Resource Utilization Experiment',
    mede: t('Produção de oxigênio a partir do CO₂ atmosférico'),
    unidade: t('g/h de O₂'),
    plataforma: t('Perseverance'),
    ridge: 'E',
    nota: t('Operou de 2021 a 2023. Prova de conceito para habitat.'),
  },
  ECLSS: {
    id: 'ECLSS',
    nome: 'ECLSS',
    completo: 'Environmental Control and Life Support System',
    mede: t('Geração de O₂, remoção de CO₂, reciclagem de água, pressão'),
    unidade: t('% O₂ · kPa · L/dia'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Conjunto de sistemas, não um sensor único.'),
  },
  WRS: {
    id: 'WRS',
    nome: 'WRS',
    completo: 'Water Recovery System',
    mede: t('Pureza da água reciclada'),
    unidade: t('condutividade elétrica · % de recuperação'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Sensores de condutividade verificam pureza.'),
  },
  PLSS: {
    id: 'PLSS',
    nome: 'PLSS',
    completo: 'Portable Life Support System',
    mede: t('O₂, CO₂, água de resfriamento e pressão do traje'),
    unidade: t('kPa · % O₂ · autonomia em horas'),
    plataforma: t('Traje EVA'),
    ridge: 'E',
    nota: t('A mochila do traje. Tudo que mantém o astronauta vivo fora do habitat.'),
  },
  'xEMU': {
    id: 'xEMU',
    nome: 'xEMU / AxEMU',
    completo: 'Exploration Extravehicular Mobility Unit',
    mede: t('Telemetria biométrica, pressão, temperatura, comunicação'),
    unidade: t('biométrico · kPa · °C'),
    plataforma: t('Traje EVA'),
    ridge: 'E',
    nota: t('Projetado para pressão marciana, ao contrário do EMU da ISS.'),
  },
  CAM: {
    id: 'CAM',
    nome: 'Mastcam-Z',
    completo: 'Mast Camera Zoom',
    mede: t('Imagens de alta resolução, vídeo e relevo 3D'),
    unidade: t('imagem · modelo de elevação'),
    plataforma: t('Perseverance'),
    ridge: 'E',
    nota: t('Usado para avaliar terreno e inclinação antes de rota.'),
  },
  WATSON: {
    id: 'WATSON',
    nome: 'WATSON',
    completo: 'Wide Angle Topographic Sensor for Operations and eNgineering',
    mede: t('Texturas finas de rocha e grão do solo'),
    unidade: t('imagem macro'),
    plataforma: t('SHERLOC · Perseverance'),
    ridge: 'E',
  },
  SUPER: {
    id: 'SUPER',
    nome: 'SuperCam',
    completo: 'SuperCam',
    mede: t('Composição química e mineralógica à distância'),
    unidade: t('espectro'),
    plataforma: t('Perseverance'),
    ridge: 'E',
    nota: t('Analisa alvo a 7 m com laser.'),
  },
  ACT: {
    id: 'ACT',
    nome: t('Actímetro'),
    completo: 'Active Dosimeter',
    mede: t('Dose individual acumulada do tripulante'),
    unidade: t('mSv por tripulante'),
    plataforma: t('Tripulante'),
    ridge: 'R',
    nota: t('Diferente do RAD: mede a pessoa, não o ambiente.'),
  },
  ACTI: {
    id: 'ACTI',
    nome: t('Actígrafo'),
    completo: 'Actigraph',
    mede: t('Ciclo de sono e atividade motora'),
    unidade: t('horas de sono · atividade'),
    plataforma: t('Tripulante'),
    ridge: 'I',
    nota: t('Indicador objetivo de privação de sono.'),
  },
  MEDKIT: {
    id: 'MEDKIT',
    nome: t('Kit médico'),
    completo: 'Crew Medical Kit',
    mede: t('Sinais vitais, exames e procedimentos de emergência'),
    unidade: t('biométrico'),
    plataforma: t('Habitat'),
    ridge: 'I',
  },
  ARED: {
    id: 'ARED',
    nome: 'ARED',
    completo: 'Advanced Resistive Exercise Device',
    mede: t('Força e carga de exercício resistido'),
    unidade: t('kg de carga · sessões'),
    plataforma: t('Habitat'),
    ridge: 'G',
    nota: t('Mitiga perda óssea e atrofia muscular.'),
  },
  DXA: {
    id: 'DXA',
    nome: 'Densitometria',
    completo: 'Dual-energy X-ray Absorptiometry',
    mede: t('Densidade mineral óssea'),
    unidade: t('g/cm²'),
    plataforma: t('Habitat'),
    ridge: 'G',
    nota: t('Acompanha perda óssea a cada 30 sóis.'),
  },
  RELAY: {
    id: 'RELAY',
    nome: 'Relay orbital',
    completo: 'Mars Relay Network (Odyssey · MRO · MAVEN)',
    mede: t('Janelas de comunicação superfície–Terra'),
    unidade: t('min de janela · latência'),
    plataforma: t('Orbital'),
    ridge: 'D',
    nota: t('Sem os orbitadores, a superfície fica sem enlace.'),
  },
  ECO: {
    id: 'ECO',
    nome: t('Ecocardiógrafo'),
    completo: 'Echocardiogram · Cardiac Ultrasound',
    mede: t('Volume cardíaco, débito e fluxo sanguíneo'),
    unidade: t('mL · fluxo'),
    plataforma: t('Habitat'),
    ridge: 'G',
    nota: t('Monitora adaptação cardiovascular à gravidade reduzida.'),
  },
  BIOQ: {
    id: 'BIOQ',
    nome: t('Analisador bioquímico'),
    completo: 'Biochemistry Analyzer',
    mede: t('Função renal (eGFR), eletrólitos e marcadores sanguíneos'),
    unidade: t('mL/min/1,73 m²'),
    plataforma: t('Habitat'),
    ridge: 'G',
    nota: t('Detecta risco renal associado à radiação galáctica.'),
  },
  HEPA: {
    id: 'HEPA',
    nome: 'Filtro HEPA',
    completo: 'High-Efficiency Particulate Air filter',
    mede: t('Particulados suspensos, incluindo poeira com perclorato'),
    unidade: t('µg/m³ · saturação'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Barreira contra percloratos no ar do habitat.'),
  },
  TCCS: {
    id: 'TCCS',
    nome: 'TCCS',
    completo: 'Trace Contaminant Control System',
    mede: t('Voláteis orgânicos, amônia e monóxido de carbono'),
    unidade: t('mg/m³ · ppm'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Leito de carvão ativado e oxidadores catalíticos.'),
  },
  CDRA: {
    id: 'CDRA',
    nome: 'CDRA',
    completo: 'Carbon Dioxide Removal Assembly',
    mede: t('Remoção de CO₂ da atmosfera do habitat'),
    unidade: t('% CO₂ · kg/dia'),
    plataforma: t('Habitat'),
    ridge: 'E',
  },
  OGS: {
    id: 'OGS',
    nome: 'OGS',
    completo: 'Oxygen Generation System',
    mede: t('Produção de O₂ por eletrólise da água'),
    unidade: t('kg/dia de O₂'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Pares com o reator Sabatier para recuperar O₂ do CO₂.'),
  },
  FREEZER: {
    id: 'FREEZER',
    nome: t('Freezer científico'),
    completo: 'Sample and Medical Freezer',
    mede: t('Temperatura de armazenamento de amostras e medicamentos'),
    unidade: t('°C · excursões térmicas'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Cadeia de frio: distinta da temperatura ambiente.'),
  },
  AIRLOCK: {
    id: 'AIRLOCK',
    nome: 'Eclusa',
    completo: 'Airlock · Suit Port',
    mede: t('Contaminação na passagem entre exterior e habitat'),
    unidade: t('% de poeira retida'),
    plataforma: t('Habitat'),
    ridge: 'E',
    nota: t('Primeira barreira contra percloratos.'),
  },
  DSL: {
    id: 'DSL',
    nome: 'DSN',
    completo: 'Deep Space Network',
    mede: t('Enlace de rádio Terra–Marte'),
    unidade: t('latência 4–24 min'),
    plataforma: t('Terra'),
    ridge: 'D',
  },
}

/** Busca um equipamento pelo id. */
export function equipamento(id: string): Equipamento | undefined {
  return EQUIPAMENTOS[id]
}
