import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchRandomWord } from '@/services/wordService'
import { API_CONFIG } from '@/config/apiConfig'

describe('wordService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchRandomWord', () => {
    it('should resolve with a word on successful fetch', async () => {
      const mockWordData = { name: 'test', categorie: 'noun' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockWordData])
      })

      const word = await fetchRandomWord()
      expect(word).toEqual({ value: 'test', category: 'noun' })
      expect(global.fetch).toHaveBeenCalledWith(API_CONFIG.WORD_API_URL)
    })

    it('should reject when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(fetchRandomWord()).rejects.toThrow('Impossible de récupérer un mot')
    })

    it('should reject when no word data is available', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      })

      await expect(fetchRandomWord()).rejects.toBeNull()
    })

    it('should reject on fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(fetchRandomWord()).rejects.toThrow('Network error')
    })
  })
})
