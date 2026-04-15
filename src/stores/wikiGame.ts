import { defineStore } from 'pinia'
import { useWikiGameLogic } from '@/composables/useWikiGameLogic'
import type { Article } from '@/services/wikiService'

export const useWikiGameStore = defineStore('wikiGame', () => {
  function submit(article: Article) {
    if (randomArticle.value) {
      incNbGames()
      if (randomArticle.value.article === article.article) {
        message.value = `Correct ! ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'success'
      } else {
        message.value = `Incorrect ! Solution : ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'warning'
      }
      timeOutNewWord()
    }
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
    resetHistory,
    addToHistory,
    nbGames,
    incNbGames,
    loadGuess,
    initRound,
    timeOutNewWord,
    userPts,
    addPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
  } = useWikiGameLogic('wikiHistoryItems')

  return {
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    submit,
    historyItems,
    resetHistory,
    loadGuess,
    nbGames,
    initRound,
    userPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
  }
})
