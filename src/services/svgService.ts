import type { Word } from '@/composables/Word'

export const iconType = "openmoji"

export const allowedCategories = [
  //'Animals Nature',
  //'Objects',
  //'Food Drink',
  'Activities'
]

export const buildSvgUrl = (keyword: string): string =>
  `https://api.iconify.design/${iconType}:${keyword}.svg`

export const getRandomKeyword = (icons: Word[]): Word => {
  //return { value: 'falafel', category: 'Objects' }
  if (icons.length === 0) return { value: 'accordion', category: 'Objects' }
  const icon = icons[Math.floor(Math.random() * icons.length)]
  return icon!
}

export const loadSvg = async (keyword: string): Promise<string> => {
  const svgUrl: string = buildSvgUrl(keyword)
  const response = await fetch(svgUrl)
  if (!response.ok) {
    throw new Error(`Unable to load SVG: ${response.status} ${response.statusText}`)
  }
  return response.text()
}

export const loadIcons = async (): Promise<Word[]> => {
  try {
    const response = await fetch(`https://api.iconify.design/collection?prefix=${iconType}`)
    const data = await response.json()
    const words: Word[] = []

    for (const category of allowedCategories) {
      if (data.categories?.[category]) {
        const icons = data.categories?.[category]
        if (Array.isArray(icons)) {
          icons.forEach((name: string) => {
            if (!name.includes('-')) {
              words.push({ value: name, category })
            }
          })
        }
      }
    }
    return words
  } catch (error) {
    return []
  }
}
