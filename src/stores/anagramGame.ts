import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWordGameLogic } from '@/composables/useWordGameLogic'

type AlertType = 'info' | 'success' | 'warning' | 'error'

export const useAnagramGameStore = defineStore('anagramGame', () => {
  const scrambledWord = ref<string>('')

  // Function to scramble a word
  function scrambleWord(word: string): string {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = letters[i]!
      letters[i] = letters[j]!
      letters[j] = temp
    }
    return letters.join('')
  }

  function revealAnagramSolution() {
    scrambledWord.value = wordToGuess.value
    revealSolution()
  }

  const initCallback = (word: string, category: string) => {
    scrambledWord.value = scrambleWord(word)
    message.value = 'Réarrangez les lettres pour former le mot caché.'
  }

  const {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    wordFound,
    setFocusCallback,
    cancelGame,
    resethistoryItems,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    checkGuessOnInput,
    revealSolution,
    getWordToGuessLetter,
    typeAlert,
    baseHue,
    historyItems,
  } = useWordGameLogic(initCallback, 'anagramhistoryItems')

  return {
    wordToGuess,
    scrambledWord,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    wordFound,
    setFocusCallback,
    cancelGame,
    resethistoryItems,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    checkGuessOnInput,
    revealAnagramSolution,
    getWordToGuessLetter,
    typeAlert,
    baseHue,
    historyItems,
  }
})
