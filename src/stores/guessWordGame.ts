import { defineStore } from 'pinia'
import { useWordGameLogic } from '@/composables/useWordGameLogic'

export const useGameStore = defineStore('guessWordGame', () => {
  const initCallback = () => {
    message.value =
      "Chaque couleur représente une lettre différente de l'alphabet suivant l'ordre du spectre."
  }

  const {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    setFocusCallback,
    cancelGame,
    resethistory,
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
  } = useWordGameLogic(initCallback, 'historyItems')

  return {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    setFocusCallback,
    cancelGame,
    resethistory,
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
