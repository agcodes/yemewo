import { defineStore } from 'pinia'
import { useWikiGameLogic } from '@/composables/useWikiGameLogic'
import type { Article } from '@/services/wikiService'

export const useWikiGameStore = defineStore('wikiGame', () => {
  function submit(article: Article) {
    if (randomArticle.value) {
      incNbRoundGames()
      if (randomArticle.value.article === article.article) {
        message.value = `Correct ! ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'success'
        addToHistory(randomArticle.value.title, true)
        addRoundPts(1)
      } else {
        message.value = `Incorrect ! Solution : ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'warning'
        addToHistory(randomArticle.value.title, false)
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
    nbRoundGames,
    nbRounds,
    incNbRoundGames,
    loadGuess,
    initRound,
    timeOutNewWord,
    roundPts,
    addRoundPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
    elapsedTime,
    updateElapsedTime,
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
    nbRoundGames,
    nbRounds,
    initRound,
    roundPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words,
    elapsedTime,
    updateElapsedTime,
  }
})
