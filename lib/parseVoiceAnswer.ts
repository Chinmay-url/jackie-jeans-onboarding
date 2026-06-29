import { BRANDS, DENIM_SIZES } from './questions'

function wordToDigit(s: string): string {
  const entries = [
    ['seventeen', '17'], ['eighteen', '18'], ['nineteen', '19'],
    ['thirteen', '13'], ['fourteen', '14'], ['fifteen', '15'], ['sixteen', '16'],
    ['twelve', '12'],
    ['eleven', '11'], ['twenty', '20'], ['thirty', '30'],
    ['forty', '40'], ['fifty', '50'], ['sixty', '60'],
    ['zero', '0'], ['one', '1'], ['two', '2'], ['three', '3'], ['four', '4'],
    ['five', '5'], ['six', '6'], ['seven', '7'], ['eight', '8'], ['nine', '9'], ['ten', '10'],
  ]
  let result = s
  for (const [word, num] of entries) {
    result = result.replace(new RegExp(word, 'g'), num)
  }
  return result
}

export function parseHeight(speech: string): string | null {
  const cleaned = speech.toLowerCase().trim()
  
  const patterns = [
    /(\d)\s*(?:foot|feet|ft|'|′)\s*(\d+)\s*(?:inch|inches|in|"|″)?/,
    /(\d)\s+(\d+)/,
  ]
  
  for (const p of patterns) {
    const m = cleaned.match(p)
    if (m) {
      return `${m[1]}'${m[2]}"`
    }
  }
  
  let parsed = wordToDigit(cleaned)
  
  const m2 = parsed.match(/(\d)\s*(?:foot|feet|ft|')\s*(\d+)/)
  if (m2) return `${m2[1]}'${m2[2]}"`

  const m3 = parsed.match(/(\d)\s*[-\s.,]?\s*(\d+)/)
  if (m3) {
    const ft = parseInt(m3[1])
    const inch = parseInt(m3[2])
    if (ft >= 4 && ft <= 6 && inch >= 0 && inch <= 11) {
      return `${ft}'${inch}"`
    }
  }
  
  return null
}

export function parseNumber(speech: string): number | null {
  const cleaned = speech.toLowerCase().trim()
  if (cleaned.includes('skip') || cleaned.includes('pass') || cleaned.includes('rather not')) return -1
  const match = cleaned.match(/(\d+)/)
  if (match) return parseInt(match[1])
  return null
}

export function parseMeasurement(speech: string): string | null {
  const cleaned = wordToDigit(speech.toLowerCase().trim())
  const match = cleaned.match(/(\d+)\s*(?:inch|inches|in|")?/)
  if (match) {
    const n = parseInt(match[1])
    if (n >= 20 && n <= 70) return `${n}"`
  }
  return null
}

export function parseSingleSelect(speech: string, options: string[]): string | null {
  const cleaned = speech.toLowerCase().trim()
  for (const option of options) {
    if (cleaned.includes(option.toLowerCase())) return option
  }
  for (const option of options) {
    const words = option.toLowerCase().split(' ')
    if (words.some(w => cleaned.includes(w) && w.length > 3)) return option
  }
  return null
}

export function parseBrands(speech: string): string[] {
  const cleaned = speech.toLowerCase().trim()
  const found: string[] = []
  for (const brand of BRANDS) {
    if (cleaned.includes(brand.toLowerCase().replace("'", ""))) {
      found.push(brand)
    }
  }
  return found
}

export function parseDenimSize(speech: string): string | null {
  let cleaned = speech.toLowerCase().trim()

  for (const size of DENIM_SIZES) {
    if (cleaned.includes(size.toLowerCase())) return size
  }

  cleaned = wordToDigit(cleaned)

  const match = cleaned.match(/\b(\d+)\b/)
  if (match) {
    const n = parseInt(match[1])
    const str = String(n)
    if (DENIM_SIZES.includes(str)) return str
  }

  return null
}
