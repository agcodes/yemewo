import { ref } from 'vue'
import { useGameLogic } from '@/composables/useGameLogic'
import type { Article } from '@/services/wikiService'
import { useRequestLimitStore } from '@/stores/requestLimit'

import {
  scrambleArticleContent,
  maskTitleWordsInContent,
  fetchTopWikipediaArticles,
  getArticle,
  getSuffleWords,
} from '@/services/wikiService'

export function useWikiGameLogic(storageKey: string) {
  const words = ref<string[] | null>(null)
  const articles = ref<Article[] | null>(null)
  const randomArticle = ref<Article | null>(null)
  const selectedArticles = ref<Article[]>([])
  const requestLimitStore = useRequestLimitStore()
  const limit = 150
  let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const initGuess = () => {
    roundPts.value = 0
    nbRoundGames.value = 0
    message.value = 'Choisir un article parmi les propositions'
    typeAlert.value = 'info'
  }

  function timeOutNewWord() {
    loadingNewGame.value = true
    // new game after 3 seconds
    autoNextTimer.value = setTimeout(() => {
      loadGuess()
    }, 3000)
  }

  const loadGuess = async () => {
    loadingError.value = false
    isLoading.value = true
    
    if (nbRoundGames.value >= gamesPerRound.value) {
      initRound()
      message.value = `Début d'un nouveau round !`
    } else {
       message.value = 'Choisir un article parmi les propositions'
    }
    
    typeAlert.value = 'info'
    if (requestLimitStore.canMakeRequest(limit) == false) {
      loadingError.value = true
      return
    }

    try {
      requestLimitStore.incrementRequestCount()

      if (!articles.value || articles.value.length < 10) {
        initGuess()
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 2)
        const year = yesterday.getFullYear()
        const month = String(yesterday.getMonth() + 1).padStart(2, '0')
        const day = String(yesterday.getDate()).padStart(2, '0')

        const formattedDate = `${year}/${month}/${day}`

        fetchTopWikipediaArticles(formattedDate, 500, 30)
          .then((topArticles) => {
            articles.value = topArticles
            loadArticles(0)
          })
          .catch((error) => {
            loadingError.value = true
          })
      } else {
        loadArticles(0)
      }
    } catch (error) {
      loadingError.value = true
    }
  }

  const loadArticles = (index: number) => {
    if (articles.value && articles.value.length > 0) {
      selectedArticles.value = []
      randomArticle.value = null

      const randomIndex = Math.floor(Math.random() * articles.value.length)

      if (!articles.value[randomIndex]) {
        loadingError.value = true
        return
      }

      getArticle(articles.value[randomIndex])
        .then((data) => {
          if (articles.value && articles.value.length > 0) {
            const article = data
            if (
              articles.value != null &&
              article != null &&
              article.content &&
              article.content.length > 0
            ) {
              article.content = maskTitleWordsInContent(article.content, article.title)

              words.value = getSuffleWords(article.content, 18)

              if (article.content.length > 500) {
                article.content = article.content.substring(0, 500)
              }

              article.scrambledContent = scrambleArticleContent(article.content)

              randomArticle.value = article

              // remove article
              articles.value.splice(randomIndex, 1)
              article.originalTitle = article.title

              selectedArticles.value.push(randomArticle.value)

              getOtherArticles()

              startTimer()
            } else if (index < 2) {
              index++
              loadArticles(index)
            } else {
              loadingError.value = true
            }
          } else {
            loadingError.value = true
          }
        })
        .catch((error) => {
          loadingError.value = true
        })
    }
  }

  const getOtherArticles = () => {
    if (articles.value && articles.value.length > 0) {
      const nbOtherArticles = 4
      for (let i = 0; i < nbOtherArticles && articles.value.length > 0; i++) {
        // get random article in articles
        const randomIndex = Math.floor(Math.random() * articles.value.length)

        if (!articles.value[randomIndex]) {
          loadingError.value = true
          return
        }
        getArticle(articles.value[randomIndex])
          .then((article2) => {
            if (article2 != null && article2.title) {
              article2.originalTitle = article2.title

              // add to articles
              selectedArticles.value.push(article2)
              if (selectedArticles.value.length == nbOtherArticles) {
                isLoading.value = false
                selectedArticles.value = shuffleArray(selectedArticles.value)
                selectedArticles.value = shuffleArray(selectedArticles.value)
              }
            }
          })
          .catch((error) => {
            loadingError.value = true
          })
      }
    }
  }

  const shuffleArray = (array: Article[]): Article[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = newArray[i] as Article
      newArray[i] = newArray[j] as Article
      newArray[j] = temp
    }
    return newArray
  }

  const {
    gamesPerRound,
    gameRounds,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    historyItems,
    startTimer,
    startTime,
    nbRounds,
    loadingNewGame,
    addToHistory,
    resetHistory,
    loadHistory,
    addRoundPts,
    incNbRoundGames,
    initRound,
    nbRoundGames,
    roundPts,
    elapsedTime,
    updateElapsedTime,
  } = useGameLogic(storageKey)

  loadHistory(4)

  return {
    gamesPerRound,
    gameRounds,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    historyItems,
    addToHistory,
    resetHistory,
    addRoundPts,
    incNbRoundGames,
    loadGuess,
    initRound,
    timeOutNewWord,
    roundPts,
    nbRoundGames,
    nbRounds,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
    elapsedTime,
    updateElapsedTime,
  }
}
