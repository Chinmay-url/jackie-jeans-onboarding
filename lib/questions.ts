export type QuestionType = 
  | 'dropdown' 
  | 'number' 
  | 'single-select' 
  | 'multi-select' 
  | 'brand-sizes'

export interface Question {
  id: number
  key: string
  text: string
  voiceText: string
  type: QuestionType
  options?: string[]
  optional?: boolean
  dependsOn?: string
  hint?: string
}

const heights: string[] = []
for (let ft = 4; ft <= 6; ft++) {
  const maxIn = ft === 4 ? 10 : ft === 5 ? 11 : 2
  const minIn = ft === 4 ? 10 : 0
  for (let inch = minIn; inch <= maxIn; inch++) {
    heights.push(`${ft}'${inch}"`)
  }
}

const waists: string[] = []
for (let i = 24; i <= 52; i++) waists.push(`${i}"`)

const hips: string[] = []
for (let i = 32; i <= 60; i++) hips.push(`${i}"`)

export const BRANDS = [
  'Levi\'s', 'Wrangler', 'Lee', 'Gap', 'American Eagle',
  'Hollister', 'Abercrombie', 'Madewell', 'Everlane', 'Zara',
  'H&M', 'Uniqlo', 'J.Crew', 'Banana Republic', 'AG Jeans',
  'Frame', '7 For All Mankind', 'Citizens of Humanity', 'Paige', 'Good American'
]

export const DENIM_SIZES = [
  '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
  '33', '34', '36', '38', '40', 'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '0', '2', '4', '6', '8', '10', '12', '14', '16'
]

export const questions: Question[] = [
  {
    id: 1,
    key: 'height',
    text: 'What is your height?',
    voiceText: 'Let\'s start with your height. What\'s your height?',
    type: 'dropdown',
    options: heights,
    hint: 'Used to recommend the right inseam length'
  },
  {
    id: 2,
    key: 'weight',
    text: 'What is your weight? (optional)',
    voiceText: 'And your weight in pounds? This one\'s totally optional — just say "skip" if you\'d prefer.',
    type: 'number',
    optional: true,
    hint: 'Optional — helps calibrate your proportional fit'
  },
  {
    id: 3,
    key: 'waist',
    text: 'Waist measurement (narrowest point)',
    voiceText: 'What\'s your waist measurement in inches, at the narrowest point?',
    type: 'dropdown',
    options: waists,
    hint: 'Measure at the narrowest part of your waist'
  },
  {
    id: 4,
    key: 'hips',
    text: 'Hip measurement (fullest point)',
    voiceText: 'And your hip measurement in inches at the fullest point?',
    type: 'dropdown',
    options: hips,
    hint: 'Measure around the fullest part of your hips'
  },
  {
    id: 5,
    key: 'waistFit',
    text: 'How do you like jeans to fit at the waist?',
    voiceText: 'How do you like jeans to fit at the waist — snug, slightly relaxed, or relaxed?',
    type: 'single-select',
    options: ['Snug', 'Slightly relaxed', 'Relaxed'],
  },
  {
    id: 6,
    key: 'rise',
    text: 'Where should the waistband sit?',
    voiceText: 'Where do you like the waistband to sit — high rise, mid rise, or low rise?',
    type: 'single-select',
    options: ['High rise', 'Mid rise', 'Low rise'],
  },
  {
    id: 7,
    key: 'thighFit',
    text: 'How should jeans fit through the thighs?',
    voiceText: 'And through the thighs — fitted, relaxed, or loose?',
    type: 'single-select',
    options: ['Fitted', 'Relaxed', 'Loose'],
  },
  {
    id: 8,
    key: 'brands',
    text: 'Which denim brands have you bought before?',
    voiceText: 'Which denim brands have you bought before? You can name as many as you like.',
    type: 'multi-select',
    options: BRANDS,
    hint: 'Select all that apply'
  },
  {
    id: 9,
    key: 'brandSizes',
    text: 'What size did you buy in those brands?',
    voiceText: 'For each brand you mentioned, what size did you usually buy?',
    type: 'brand-sizes',
    dependsOn: 'brands',
    hint: 'Tell us your size in each brand'
  },
  {
    id: 10,
    key: 'frustration',
    text: 'Biggest fit frustration when buying jeans?',
    voiceText: 'Last one — what\'s your biggest frustration when buying jeans? Waist gap, hip tightness, wrong length, thigh fit, rise, or something else?',
    type: 'single-select',
    options: ['Waist gap', 'Hip tightness', 'Wrong length', 'Thigh fit', 'Rise', 'Other'],
  }
]
