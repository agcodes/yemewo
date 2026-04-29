import { defineStore } from 'pinia'
import { useWordGameLogic } from '@/composables/useWordGameLogic'
import { fetchRandomWord } from '@/services/wordService'
import type { Word } from '@/composables/Word'

export const useGameStore = defineStore('guessWordGame', () => {
  const initCallback = (word: Word) => {
    if (nbRoundGames.value >= gamesPerRound.value) {
      initRound()
      message.value = `Début d'un nouveau round !`
    } else {
      message.value =
      "Deviner le mot. Chaque couleur représente une lettre différente de l'alphabet."
    }
  }

  const {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    nbRounds,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingError,
    loadingNewGame,
    nbGoodLetters,
    setFocusCallback,
    cancelGame,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    checkGuessOnInput,
    revealSolution,
    getWordToGuessLetter,
    wordFound,
    typeAlert,
    baseHue,
    historyItems,
  } = useWordGameLogic(initCallback, 'historyItems', fetchRandomWord)

  return {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    nbRounds,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingError,
    loadingNewGame,
    nbGoodLetters,
    setFocusCallback,
    cancelGame,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    revealSolution,
    getWordToGuessLetter,
    wordFound,
    checkGuessOnInput,
    typeAlert,
    baseHue,
    historyItems,
  }
})
