import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  iconType,
  allowedCategories,
  buildSvgUrl,
  getRandomKeyword,
  loadSvg,
  loadIcons
} from '@/services/svgService'
import type { Word } from '@/composables/Word'

describe('svgService', () => {
  describe('buildSvgUrl', () => {
    it('should build correct SVG URL from keyword', () => {
      const url = buildSvgUrl('falafel')
      expect(url).toBe('https://api.iconify.design/openmoji:falafel.svg')
    })
  })

  describe('getRandomKeyword', () => {
    it('should return default icon when icons array is empty', () => {
      const result = getRandomKeyword([])
      expect(result).toEqual({ value: 'accordion', category: 'Objects' })
    })

    it('should return a random icon from the list', () => {
      const icons: Word[] = [
        { value: 'cat', category: 'Animals Nature' },
        { value: 'dog', category: 'Animals Nature' },
        { value: 'apple', category: 'Food Drink' }
      ]

      // Mock Math.random to return predictable values
      const originalRandom = Math.random
      Math.random = () => 0.5 // Will pick index 1 (dog)

      const result = getRandomKeyword(icons)
      expect(result).toEqual({ value: 'dog', category: 'Animals Nature' })

      Math.random = originalRandom
    })
  })

  describe('loadSvg', () => {
    it('should load SVG content from URL', async () => {
      const mockSvgContent = '<svg>test content</svg>'
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockSvgContent)
      })

      const content = await loadSvg('test-icon')
      expect(content).toBe(mockSvgContent)
      expect(global.fetch).toHaveBeenCalledWith('https://api.iconify.design/openmoji:test-icon.svg')
    })

    it('should throw error when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(loadSvg('nonexistent')).rejects.toThrow('Unable to load SVG: 404 Not Found')
    })

    it('should throw error on fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(loadSvg('test-icon')).rejects.toThrow('Network error')
    })
  })

  describe('loadIcons', () => {
    it('should load and filter icons by allowed categories', async () => {
      const mockData = {
        categories: {
          'Animals Nature': ['cat', 'dog', 'elephant'],
          'Objects': ['car', 'house'],
          'Food Drink': ['apple', 'banana'],
          'Activities': ['soccer', 'tennis'],
          'Other': ['test'] // Should be filtered out
        }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const icons = await loadIcons()
      
      // Should include icons from allowed categories only
      expect(icons).toContainEqual({ value: 'cat', category: 'Animals Nature' })
      expect(icons).toContainEqual({ value: 'car', category: 'Objects' })
      expect(icons).toContainEqual({ value: 'apple', category: 'Food Drink' })
      expect(icons).toContainEqual({ value: 'soccer', category: 'Activities' })
      
      // Should not include icons from other categories
      expect(icons).not.toContainEqual({ value: 'test', category: 'Other' })
      
      // Should filter out icons with hyphens
      expect(icons).not.toContainEqual({ value: 'some-name', category: 'Objects' })
    })

    it('should return empty array on fetch error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const icons = await loadIcons()
      expect(icons).toEqual([])
    })

    it('should handle missing categories in response', async () => {
      const mockData = { categories: {} }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const icons = await loadIcons()
      expect(icons).toEqual([])
    })
  })

  describe('constants', () => {
    it('should have correct iconType', () => {
      expect(iconType).toBe('openmoji')
    })

    it('should have correct allowedCategories', () => {
      expect(allowedCategories).toEqual([
        'Animals Nature',
        'Objects',
        'Food Drink',
        'Activities'
      ])
    })
  })
})
