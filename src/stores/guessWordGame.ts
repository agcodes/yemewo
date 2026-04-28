import { defineStore } from 'pinia'
import { useWordGameLogic } from '@/composables/useWordGameLogic'
import { fetchRandomWord } from '@/services/wordService'
import type { Word } from '@/composables/Word'

export const useGameStore = defineStore('guessWordGame', () => {
  const initCallback = (word: Word) => {
    message.value =
      "Chaque couleur représente une lettre différente de l'alphabet suivant l'ordre du spectre."
  }

  const {
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
