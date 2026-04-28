import { defineStore } from 'pinia'
import type { Article } from '@/services/wikiService'
import { useGameLogic } from '@/composables/useGameLogic'

export const useGuessDrawingGameStore = defineStore('guessDrawingGame', () => {
  function submit(article: Article) {}

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
    initRound,
    roundPts,
    addRoundPts,
    startTime,
    elapsedTime,
    updateElapsedTime,
  } = useGameLogic('wikiHistoryItems')

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
    nbRoundGames,
    nbRounds,
    initRound,
    roundPts,
    startTime,
    elapsedTime,
    updateElapsedTime,
  }
})
