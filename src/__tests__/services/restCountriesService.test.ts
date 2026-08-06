import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Country, RestCountriesService } from '@/services/restCountriesService'

describe('Country', () => {
  it('should create a Country instance with all properties', () => {
    const data = {
      names: { 
        common: 'France',
        translations: { fra: { common: 'France' } }
      },
      capital: ['Paris'],
      flag: {
        url_png: 'france.png',
        url_svg: 'france.svg'
      },
      flags: {
        alt: 'Drapeau français'
      }
    }
    const country = new Country(data)
    expect(country.name).toBe('France')
    expect(country.localName).toBe('France')
    expect(country.capitals).toEqual(['Paris'])
    expect(country.flagPng).toBe('france.png')
    expect(country.flagSvg).toBe('france.svg')
    expect(country.flagDescription).toBe('Drapeau français')
    expect(country.alreadyUsed).toBe(false)
  })

  it('should handle missing properties with defaults', () => {
    const data = {}
    const country = new Country(data)
    expect(country.name).toBe('')
    expect(country.localName).toBe('')
    expect(country.capitals).toEqual([])
    expect(country.flagPng).toBe('')
    expect(country.flagSvg).toBe('')
    expect(country.flagDescription).toBe('')
    expect(country.alreadyUsed).toBe(false)
  })
})

describe('RestCountriesService', () => {
  const mockBaseUrl = 'https://mock-api.test'
  let service: RestCountriesService

  beforeEach(() => {
    localStorage.clear()
    service = new RestCountriesService(mockBaseUrl, "", false)
  })

  describe('getCountries', () => {
    it('should resolve with countries on successful fetch', async () => {
      const mockData = {
        data: {
          objects: [
            {
              names: { 
                common: 'France',
                translations: { fra: { common: 'France' } }
              },
              capital: ['Paris'],
              flag: { url_png: 'fr.png', url_svg: 'fr.svg' },
              flags: { alt: 'French flag' }
            },
            {
              names: { 
                common: 'Germany',
                translations: { fra: { common: 'Allemagne' } }
              },
              capital: ['Berlin'],
              flag: { url_png: 'de.png', url_svg: 'de.svg' },
              flags: { alt: 'German flag' }
            }
          ]
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const countries = await service.getCountries()
      expect(countries).toBeDefined()
      expect(countries).toHaveLength(2)
      expect(countries![0]!.name).toBe('France')
      expect(countries![1]!.name).toBe('Germany')
      expect(global.fetch).toHaveBeenCalledWith(mockBaseUrl, {
        headers: { 'Authorization': 'Bearer ' }
      })
      
    })

    it('should reject with error on failed fetch', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.getCountries()).rejects.toThrow('Network error')
    })

    it('should reject with error when no results are returned', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      })

      await expect(service.getCountries()).rejects.toBe('error')
    })
  })

  describe('getCountry', () => {
    it('should return a country by name', async () => {
      const mockData = {
        data: {
          objects: [
            {
              names: { 
                common: 'France',
                translations: { fra: { common: 'France' } }
              },
              capital: ['Paris'],
              flag: { url_png: 'fr.png', url_svg: 'fr.svg' },
              flags: { alt: 'French flag' }
            }
          ]
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const country = await service.getCountry('France')
      expect(country.name).toBe('France')
    })

    it('should return empty Country when not found', async () => {
      const mockData = {
        data: {
          objects: [
            {
              names: { 
                common: 'France',
                translations: { fra: { common: 'France' } }
              },
              capital: ['Paris'],
              flag: { url_png: 'fr.png', url_svg: 'fr.svg' },
              flags: { alt: 'French flag' }
            }
          ]
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const country = await service.getCountry('Germany')
      expect(country.name).toBe('')
    })
  })

  describe('getRandomCountry', () => {
    it('should return a random country from the list', async () => {
      const mockData = {
        data: {
          objects: [
            {
              names: { 
                common: 'France',
                translations: { fra: { common: 'France' } }
              },
              capital: ['Paris'],
              flag: { url_png: 'fr.png', url_svg: 'fr.svg' },
              flags: { alt: 'French flag' }
            },
            {
              names: { 
                common: 'Germany',
                translations: { fra: { common: 'Allemagne' } }
              },
              capital: ['Berlin'],
              flag: { url_png: 'de.png', url_svg: 'de.svg' },
              flags: { alt: 'German flag' }
            }
          ]
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      // Mock Math.random to return a predictable value
      const originalRandom = Math.random
      Math.random = () => 0.5 // Will pick index 1 (Germany)

      const country = await service.getRandomCountry()
      expect(country.name).toBe('Germany')

      Math.random = originalRandom
    })

    it('should reject with error when no countries available', async () => {
      const mockData = {
        data: {
          objects: []
        }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      await expect(service.getRandomCountry()).rejects.toThrow()
    })
  })
})
