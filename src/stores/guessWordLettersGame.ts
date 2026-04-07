import { defineStore } from 'pinia'
import { useGameLogic, type WordLetter } from '@/composables/useGameLogic'
import { ref } from 'vue'

export const useGameStore = defineStore('guessWordLettersGame', () => {
  const userLetterGuess = ref<string>('')

  const initCallback = () => {
    message.value = ''
  }

  function getUserLetter(letter: string): WordLetter | undefined {
    return userLetters.value.find((wl) => wl.letter.toLowerCase() === letter.toLowerCase())
  }

  function getWordLetter(letter: string): WordLetter | undefined {
    return wordLetters.value.find((wl) => wl.letter.toLowerCase() === letter.toLowerCase())
  }

  function checkLetterGuessOnInput() {
    if (!userLetterGuess.value) return

    const letter = userLetterGuess.value.trim().toLowerCase()

    const userLetter = getUserLetter(letter)

    let found = false
    userLetterGuess.value = ''
    wordLetters.value.forEach((wl) => {
      if (wl.letter.toLowerCase() === letter) {
        wl.found = true
        found = true
      }
    })

    const wordLettersString = wordLetters.value
      .filter((wl) => wl.found)
      .map((wl) => wl.letter)
      .join('')

    console.log('wordLettersString', wordLettersString)
    if (wordLettersString === wordToGuess.value.toLowerCase()) {
      validateGuess(wordLettersString)
      return true
    }

    if (!userLetter) {
      if (!found) {
        userLetters.value.pop()
        userLetters.value.unshift({ letter, found: found })

        if (userLetters.value.filter((l) => l.letter != '').length == 9) {
          discardWord(`Vous avez dépassé les 9 essais ! Le mot était : ${wordToGuess.value}.`)
        }
      }
    }
  }

  const {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    wordLetters,
    loadingNewGame,
    userLetters,
    validateGuess,
    setFocusCallback,
    cancelGame,
    discardWord,
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
  } = useGameLogic(initCallback, 'guesswordlettersfoundWords')

  return {
    wordToGuess,
    userLetterGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    wordLetters,
    loadingNewGame,
    userLetters,
    setFocusCallback,
    cancelGame,
    resetFoundWords,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    revealSolution,
    getWordToGuessLetter,
    checkLetterGuessOnInput,
    wordFound,
    checkGuessOnInput,
    typeAlert,
    baseHue,
    foundWords,
  }
})
