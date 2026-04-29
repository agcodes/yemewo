// src/services/wikiService.ts
import axios from 'axios'
import DOMPurify from 'dompurify'

// Définir le type pour un article
export interface Article {
  article: string
  views: number
  originalTitle: string
  title: string
  content?: string
  scrambledContent?: string
}

interface WikipediaArticle {
  pageid: string
  ns: number
  title: string
  extract: string
}
const API_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top'

export const fetchTopWikipediaArticles = async (
  date: string,
  nb: number,
  nbMaxCharacters: number,
): Promise<Article[]> => {
  try {
    const response = await axios.get(`${API_URL}/fr.wikipedia/all-access/${date}`)
    const articles = response.data.items[0].articles
    const filteredArticles = articles.filter((article: Article) => {
      return (
        article.article.length <= nbMaxCharacters &&
        article.article.indexOf(':') < 0 &&
        article.article.indexOf('Décès') < 0
      )
    })

    // Trier les articles par nombre de vues en ordre décroissant
    const sortedArticles = filteredArticles.sort((a: Article, b: Article) => b.views - a.views)

    if (sortedArticles.length < nb) {
      return sortedArticles
    }

    return sortedArticles.slice(0, nb)
  } catch (error) {
    console.error('Error fetching top Wikipedia articles:', error)
    throw error
  }
}

// Fonction pour obtenir un article aléatoire
export const getRandomArticle = async (date: string): Promise<Article | null> => {
  try {
    const articles = await fetchTopWikipediaArticles(date, 50, 25)
    if (articles.length === 0) {
      return null // Retourne null si la liste est vide
    }

    const randomIndex = Math.floor(Math.random() * articles.length)
    const randomArticle = articles[randomIndex]
    if (randomArticle) {
      // Récupérer le contenu de l'article
      const data = await fetchWikipediaArticle(randomArticle.article)
      if (data) {
        randomArticle.content = data.extract
        randomArticle.title = data.title
      }

      return randomArticle
    }
    return null // Retourne null si aucun article n'est trouvé
  } catch (error) {
    console.error('Error getting random article:', error)
    throw error
  }
}

// Fonction pour obtenir un article aléatoire

export const getArticle = (article: Article): Promise<Article | null> => {
  return new Promise((resolve, reject) => {
    fetchWikipediaArticle(article.article)
      .then((data) => {
        if (data) {
          article.content = DOMPurify.sanitize(data.extract)
          article.title = DOMPurify.sanitize(data.title)
          resolve(article)
        } else {
          resolve(null)
        }
      })
      .catch((error) => {
        console.error('Error getting article:', error)
        reject(error)
      })
  })
}

// Fonction pour récupérer le contenu d'un article Wikipédia en utilisant des Promises
const fetchWikipediaArticle = (title: string): Promise<WikipediaArticle | null> => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(
        title,
      )}&explaintext=1&origin=*`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        const pages = data.query.pages
        const pageIds = Object.keys(pages)
        if (pageIds.length === 0) {
          reject('Not found')
          return
        }

        const pageId = pageIds[0]

        if (pageId === '-1') {
          resolve(null)
        } else {
          // Resolve with the article object
          const page = pages[pageId as keyof typeof pages]
          resolve(page as WikipediaArticle)
        }
      })
      .catch((error) => {
        console.error('Error fetching Wikipedia article content:', error)
        reject(error)
      })
  })
}

// Fonction pour mélanger les lettres d'un mot tout en laissant la première et la dernière lettre inchangées
const shuffleWord = (word: string): string => {
  if (word.length <= 2) {
    return word // Retourne le mot tel quel s'il a 2 lettres ou moins
  }

  const letters = word.split('')
  const firstLetter = letters.shift() as string
  const lastLetter = letters.pop() as string

  // Mélange les lettres du milieu
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = letters[i] as string
    letters[i] = letters[j] as string
    letters[j] = temp
  }

  return firstLetter + letters.join('') + lastLetter
}

// Fonction pour mélanger les lettres de chaque mot dans le contenu
export const scrambleArticleContent = (content: string): string => {
  return content
    .split(/(\s+)/) // Divise le contenu en mots et espaces
    .map((wordOrSpace) => {
      if (wordOrSpace.trim().length === 0) {
        return wordOrSpace // Retourne les espaces inchangés
      }
      return shuffleWord(wordOrSpace)
    })
    .join('') // Reconstruit le contenu en une seule chaîne
}

// Fonction pour mélanger les mots dans le contenu et supprimer les mots de moins de 4 caractères
export const getSuffleWords = (content: string, nbMax: number): string[] => {
  // Divise le contenu en mots et nettoie les caractères spéciaux
  const words = content
    .replace(new RegExp('[?]', 'g'), '[?]')
    .replace(/[.,/#!$%^&*;:{}=_`~()]/g, '')
    .split(/\s+/)

  // Filtre les mots pour ne garder que ceux de 4 caractères ou plus
  const filteredWords = words.filter(
    (word) =>
      word.length >= 5 &&
      word.indexOf(']') === -1 &&
      word.indexOf('[') === -1 &&
      word.indexOf('-') === -1 &&
      word !== '[?]',
  )

  // Compter la fréquence de chaque mot
  const frequencyMap: { [key: string]: number } = {}
  filteredWords.forEach((word) => {
    const lowerWord = word.toLowerCase()
    frequencyMap[lowerWord] = (frequencyMap[lowerWord] || 0) + 1
  })

  // Trier les mots par fréquence décroissante
  const sortedWords = Object.keys(frequencyMap).sort((a: string, b: string) => frequencyMap[b]! - frequencyMap[a]!)

  // Prendre les nbMax mots les plus fréquents
  const mostFrequentWords = sortedWords.slice(0, nbMax)

  // Mélanger les mots
  return shuffleStringsArray(mostFrequentWords)
}

// Fonction pour mélanger les éléments d'un tableau
export const shuffleStringsArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = newArray[i] as T
    newArray[i] = newArray[j] as T
    newArray[j] = temp
  }
  return newArray
}

export const maskTitleWordsInContent = (content: string, title: string): string => {
  title = title.replace(/!/g, '')

  let maskedContent = content.replace(/!/g, '.').replace(new RegExp(title, 'g'), '[?]')

  title = title.replace(/[.,/#!$%^&*;:{}=_`~()]/g, '')
  const words = title.split(' ')

  words.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    maskedContent = maskedContent.replace(regex, '[?]')
  })
  return maskedContent
}
