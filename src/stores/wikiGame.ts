import { defineStore } from 'pinia'
import { useWikiGameLogic } from '@/composables/useWikiGameLogic'
import type { Article } from '@/services/wikiService'

export const useWikiGameStore = defineStore('wikiGame', () => {
  function submit(article: Article) {
    isSubmitted.value = true;
    if (randomArticle.value) {
      incNbRoundGames()
      if (randomArticle.value.article === article.article) {
        message.value = `Correct ! ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'success'
        isGood.value = true;
        addToHistory(randomArticle.value.title, true)
        addRoundPts(1)
      } else {
        message.value = `Incorrect ! Solution : ${randomArticle.value.originalTitle}. Chargement d'un nouvel article...`
        typeAlert.value = 'warning'
        isGood.value = false;
        addRoundPts(0)
        addToHistory(randomArticle.value.title, false)
      }
      timeOutNewWord()
    }
  }

  const {
    startTimer,
    startTime,
    timerInterval,
    clearTimer,
    gameRounds,
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
    totalPts,
    nbGames,
    incNbRoundGames,
    loadGuess,
    initRound,
    timeOutNewWord,
    roundPts,
    addRoundPts,
    randomArticle,
    selectedArticles,
    articles,
    words,
    elapsedTime,
    updateElapsedTime,
  } = useWikiGameLogic('wikiHistoryItems')

  return {
    startTimer,
    startTime,
    timerInterval,
    clearTimer,
    message,
    gameRounds,
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
    totalPts,
    nbGames,
    initRound,
    roundPts,
    randomArticle,
    selectedArticles,
    articles,
    words,
    elapsedTime,
    updateElapsedTime,
  }
})
