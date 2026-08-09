import axios from 'axios'
import { API_CONFIG } from '@/config/apiConfig'

export interface SynonymResponse {
  success: boolean
  word: string
  synonyms: string[]
}

export async function getSynonym(word: string): Promise<SynonymResponse> {
  try {
    const response = await axios.post<SynonymResponse>(API_CONFIG.YEMEWO_SYNONYM_URL, {
      word: word
    })
    return response.data
  } catch (error) {
    console.error('Error fetching synonym:', error)
    throw error
  }
}
