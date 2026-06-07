import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import {
  fetchTopWikipediaArticles,
  getRandomArticle,
  getArticle,
  scrambleArticleContent,
  getSuffleWords,
  shuffleStringsArray,
  maskTitleWordsInContent
} from '@/services/wikiService'
import type { Article } from '@/services/wikiService'

describe('wikiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
  describe('fetchTopWikipediaArticles', () => {
    it('should fetch and filter articles successfully', async () => {
      const mockArticles: Article[] = [
        { article: 'Test Article', views: 100, originalTitle: 'Test Article', title: 'Test Article' },
        { article: 'Short', views: 50, originalTitle: 'Short', title: 'Short' },
        { article: 'Article:With:Colons', views: 75, originalTitle: 'Article:With:Colons', title: 'Article:With:Colons' },
        { article: 'Décès de quelqu\'un', views: 200, originalTitle: 'Décès de quelqu\'un', title: 'Décès de quelqu\'un' }
      ]

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = yesterday.toISOString().split('T')[0]!.replace(/-/g, '')
      const result = await fetchTopWikipediaArticles(dateStr, 3, 100)
      
      expect(result).toHaveLength(2)
      expect(result[0].article).toBe('Test Article')
      expect(result[1].article).toBe('Short')
    })

    it('should sort articles by views in descending order', async () => {
      const mockArticles = [
        { article: 'Low Views', views: 10, originalTitle: 'Low Views' },
        { article: 'Medium Views', views: 50, originalTitle: 'Medium Views' },
        { article: 'High Views', views: 100, originalTitle: 'High Views' }
      ]

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      const result = await fetchTopWikipediaArticles('20240601', 3, 100)
      expect(result).toHaveLength(3)
      const [first, second, third] = result
      expect(first!.article).toBe('High Views')
      expect(second!.article).toBe('Medium Views')
      expect(third!.article).toBe('Low Views')
      
    })

    it('should limit results to nb parameter', async () => {
      const mockArticles = Array.from({ length: 20 }, (_, i) => ({
        article: `Article ${i}`,
        views: 100 - i,
        originalTitle: `Article ${i}`
      }))

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      const result = await fetchTopWikipediaArticles('20240601', 5, 100)
      
      expect(result).toHaveLength(5)
    })

    it('should return fewer articles if not enough available', async () => {
      const mockArticles = [
        { article: 'Only One', views: 100, originalTitle: 'Only One' }
      ]

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      const result = await fetchTopWikipediaArticles('20240601', 10, 100)
      
      expect(result).toHaveLength(1)
    })

    it('should throw error on axios failure', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'))

      await expect(fetchTopWikipediaArticles('20240601', 5, 100)).rejects.toThrow('Network error')
    })
  })

  describe('getRandomArticle', () => {
    it('should return a random article with content', async () => {
      const mockArticles = [
        { article: 'Test Article', views: 100, originalTitle: 'Test Article' }
      ]

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            query: {
              pages: {
                '123': {
                  pageid: '123',
                  ns: 0,
                  title: 'Test Article',
                  extract: 'This is test content'
                }
              }
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )

      const result = await getRandomArticle('20240601')
      
      expect(result).not.toBeNull()
      const article = result!
      expect(article.article).toBe('Test Article')
      expect(article.content!).toBe('This is test content')
      expect(article.title).toBe('Test Article')
    })

    it('should return null when no articles available', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: []
            }
          ]
        }
      })

      const result = await getRandomArticle('20240601')
      
      expect(result).toBeNull()
    })

    it('should handle fetch error for article content', async () => {
      const mockArticles = [
        { article: 'Test Article', views: 100, originalTitle: 'Test Article' }
      ]

      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          items: [
            {
              articles: mockArticles
            }
          ]
        }
      })

      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Fetch error'))

      await expect(getRandomArticle('20240601')).rejects.toThrow('Fetch error')
    })
  })

  describe('getArticle', () => {
    it('should return article with sanitized content and title', async () => {
      const article: Article = {
        article: 'Test',
        title:'Test',
        views: 100,
        originalTitle: 'Test'
      }

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            query: {
              pages: {
                '123': {
                  pageid: '123',
                  ns: 0,
                  title: '<script>alert("xss")</script>Test',
                  extract: '<p>Content with tag</p>'
                }
              }
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )

      const result = await getArticle(article)
      
      expect(result).not.toBeNull()
      const articleResult = result!
      expect(articleResult.title).toBe('Test')
      expect(articleResult.content!).toBe('<p>Content with tag</p>')
    })

    it('should return null when article not found', async () => {
      const article: Article = {
        article: 'Nonexistent',
        title:'Nonexistent',
        views: 100,
        originalTitle: 'Nonexistent'
      }

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            query: {
              pages: {
                '-1': {
                  pageid: '-1',
                  ns: 0
                }
              }
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )

      const result = await getArticle(article)
      
      expect(result).toBeNull()
    })

    it('should reject on fetch error', async () => {
      const article: Article = {
        article: 'Test',
        title:  'Test',
        views: 100,
        originalTitle: 'Test'
      }

      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

      await expect(getArticle(article)).rejects.toThrow('Network error')
    })
  })

  describe('scrambleArticleContent', () => {
    it('should scramble words in content while preserving spaces', () => {
      const content = 'Hello world test'
      const result = scrambleArticleContent(content)
      
      expect(result).not.toBe(content)
      expect(result).toContain(' ')
    })

    it('should not scramble words with 2 or fewer letters', () => {
      const content = 'a an be Hello'
      const result = scrambleArticleContent(content)
      
      expect(result).toContain('a')
      expect(result).toContain('an')
      expect(result).toContain('be')
    })

    it('should keep first and last letter of each word', () => {
      const content = 'Hello'
      const result = scrambleArticleContent(content)
      
      expect(result.startsWith('H')).toBe(true)
      expect(result.endsWith('o')).toBe(true)
    })

    it('should handle empty content', () => {
      const result = scrambleArticleContent('')
      expect(result).toBe('')
    })

    it('should handle content with only spaces', () => {
      const result = scrambleArticleContent('   ')
      expect(result).toBe('   ')
    })
  })

  describe('shuffleStringsArray', () => {
    it('should shuffle array elements', () => {
      const array = [1, 2, 3, 4, 5]
      const shuffled = shuffleStringsArray(array)
      
      expect(shuffled).toHaveLength(5)
      expect(shuffled).toContain(1)
      expect(shuffled).toContain(2)
      expect(shuffled).toContain(3)
      expect(shuffled).toContain(4)
      expect(shuffled).toContain(5)
    })

    it('should not modify original array', () => {
      const array = [1, 2, 3]
      const original = [...array]
      shuffleStringsArray(array)
      
      expect(array).toEqual(original)
    })

    it('should handle empty array', () => {
      const result = shuffleStringsArray([])
      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const result = shuffleStringsArray([1])
      expect(result).toEqual([1])
    })
  })

  describe('getSuffleWords', () => {
    it('should return shuffled words filtered by length', () => {
      const content = 'Hello world this is a test content with various words'
      const result = getSuffleWords(content, 5)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(5)
      expect(result.every(word => word.length >= 5)).toBe(true)
    })

    it('should filter out words with special characters', () => {
      const content = 'Hello, world! this-is-a-test?'
      const result = getSuffleWords(content, 10)
      
      expect(result.every(word => !word.includes('-'))).toBe(true)
      expect(result.every(word => !word.includes('?'))).toBe(true)
      expect(result.every(word => word !== '[?]')).toBe(true)
    })

    it('should return most frequent words first', () => {
      const content = 'tests tests tests hello hello world world'
      // Mock Math.random to ensure consistent shuffle
      const originalRandom = Math.random
      Math.random = () => 0.5
      
      const result = getSuffleWords(content, 10)
      
      // All frequent words should be in the result
      expect(result).toContain('tests')
      expect(result).toContain('hello')
      expect(result).toContain('world')
      
      Math.random = originalRandom
    })

    it('should handle empty content', () => {
      const result = getSuffleWords('', 5)
      expect(result).toEqual([])
    })
  })

  describe('maskTitleWordsInContent', () => {
    it('should mask title words in content', () => {
      const content = 'This is a test article about test'
      const title = 'test article'
      const result = maskTitleWordsInContent(content, title)
      
      expect(result).not.toContain('test')
      expect(result).not.toContain('article')
      expect(result).toContain('[?]')
    })

    it('should handle exclamation marks in title', () => {
      const content = 'This is a test!'
      const title = 'test!'
      const result = maskTitleWordsInContent(content, title)
      
      expect(result).toContain('.') // ! replaced by .
      expect(result).not.toContain('test')
    })

    it('should mask individual words from title', () => {
      const content = 'Hello world this is a test'
      const title = 'Hello world'
      const result = maskTitleWordsInContent(content, title)
      
      expect(result).not.toContain('Hello')
      expect(result).not.toContain('world')
      expect(result).toContain('this')
      expect(result).toContain('is')
      expect(result).toContain('a')
      expect(result).toContain('test')
    })

    it('should handle special characters in title words', () => {
      const content = 'This has special, chars!'
      const title = 'special, chars!'
      const result = maskTitleWordsInContent(content, title)
      
      expect(result).not.toContain('special')
      expect(result).not.toContain('chars')
    })

    it('should handle empty title', () => {
      const content = 'Some content'
      const result = maskTitleWordsInContent(content, '')
      expect(result).toBe(content)
    })
  })
})
