import { API_CONFIG } from '@/config/apiConfig'
import type { Word } from '@/composables/Word'

export async function fetchRandomWord(): Promise<Word> {
  try {
    const response = await fetch(API_CONFIG.WORD_API_URL)
    if (!response.ok) {
      throw new Error('Impossible de récupérer un mot')
    }
    const data = await response.json()
    const wordData = data[0]
    if (!wordData) {
      throw null
    }
    return { value: wordData.name, category: wordData.categorie }
  } catch (error) {
    throw error
  }
}
