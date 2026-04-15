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

  const calcProgress = () => {
    return 0 // (nbGoodGuesses.value / nbMaxGuesses.value) * 100;
  }

  const initGuess = () => {
    userPts.value = 0
    nbGames.value = 0
    //nbTrophees.value = 0;
    //feedbackClass.value = "alert-info";
    if (nbRounds.value == 0) {
      message.value = 'Choisir un article parmi les propositions'
    } else {
      message.value = `Round ${nbRounds.value + 1}. Choisir un article parmi les propositions`
    }
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
    //showContent.value = false;
    //showSoluce.value = false;
    isLoading.value = false

    if (requestLimitStore.canMakeRequest(limit) == false) {
      loadingError.value = true
      return
    }

    try {
      //if (nbGuesses.value == nbMaxGuesses.value) {
      //if (calcProgress() > 70) {
      //  nbTrophees.value++;
      //}

      //scores.value.push(`${Math.floor(calcProgress())} %`);

      //initGuess();
      //}

      requestLimitStore.incrementRequestCount()

      if (!isLoading.value || !articles.value || articles.value.length < 10) {
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
            isLoading.value = true
            loadArticles(0)
          })
          .catch((error) => {
            isLoading.value = false
            loadingError.value = true
          })
      } else {
        loadArticles(0)
      }
    } catch (error) {
      loadingError.value = true
      console.error('Failed to get random article:', error)
    }
  }

  const loadArticles = (index: number) => {
    if (articles.value && articles.value.length > 0) {
      isLoading.value = false
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
              article &&
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

              console.log(randomArticle.value.title)
              // remove article
              articles.value.splice(randomIndex, 1)
              article.originalTitle = article.title
              //if (mode.value == "anagram-2") {
              //  article.title = scrambleArticleContent(article.title);
              //}
              selectedArticles.value.push(randomArticle.value)

              getOtherArticles()
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
            if (article2 && article2.title) {
              article2.originalTitle = article2.title
              // if (mode.value == "anagram-2") {
              //   article2.title = scrambleArticleContent(article2.title);
              // }

              // add to articles
              selectedArticles.value.push(article2)
              if (selectedArticles.value.length == nbOtherArticles) {
                isLoading.value = true
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
      if (newArray[j] && newArray[i]) {
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      }
    }
    return newArray
  }

  const {
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
    addPts,
    incNbGames,
    initRound,
    nbGames,
    userPts,
  } = useGameLogic(storageKey)

  loadHistory(4)

  return {
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
    addPts,
    incNbGames,
    loadGuess,
    initRound,
    timeOutNewWord,
    userPts,
    nbGames,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
  }
}
