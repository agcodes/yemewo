import { defineStore } from 'pinia'
import { useGameLogic } from '@/composables/useGameLogic'


export const useGameStore = defineStore('magicSquareGame', () => {
 
  const {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    totalPts,
    nbRounds,
    nbGames,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
    message,
    isLoading,
    loadingError,
    loadingNewGame,
    resetHistory,
    typeAlert,
    historyItems,
  } = useGameLogic("magicSquareItems")

  return {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    totalPts,
    nbRounds,
    nbGames,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
    message,
    isLoading,
    loadingError,
    loadingNewGame,
    resetHistory,
    typeAlert,
    historyItems,
  }
})
