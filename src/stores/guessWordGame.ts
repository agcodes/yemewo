import { defineStore } from 'pinia'
import { useGameLogic } from '@/composables/useGameLogic'

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
    resetFoundWords,
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
    foundWords,
  } = useGameLogic(initCallback, 'foundWords')

  return {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    setFocusCallback,
    cancelGame,
    resetFoundWords,
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
    foundWords,
  }
})
