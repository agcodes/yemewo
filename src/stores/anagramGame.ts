import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWordGameLogic } from '@/composables/useWordGameLogic'
import type { WordLetter } from '@/composables/WordLetter'

export const useAnagramGameStore = defineStore('anagramGame', () => {
  const scrambledWord = ref<string>('')
  const currentWord  = ref<WordLetter[]>([])
  const tempWord  = ref<WordLetter[]>([])

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

  function checkAnagramGuessOnInput(){
    
    if (areLettersMatching(userGuess.value, scrambledWord.value)){
      scrambledWord.value = userGuess.value;
    }

    const letters = userGuess.value.toLowerCase().split('')
    while (letters.length < scrambledWord.value.length) {
      letters.push('');
    }

    tempWord.value = letters.map((letter: string) => ({
      letter: letter,
      found: scrambledWord.value.toLowerCase().includes(letter.toLowerCase()),
    }))

    currentWord.value = tempWord.value;



    checkGuessOnInput();
  }

  function areLettersMatching(guess: string, scrambled: string): boolean {
    if (guess.length != scrambled.length){
      return false;
    }
    const sortedGuess = guess.toLowerCase().split('').sort().join('')
    const sortedScrambled = scrambled.toLowerCase().split('').sort().join('')
    return sortedGuess === sortedScrambled
  }

  const initCallback = (word: string, category: string) => {
    scrambledWord.value = scrambleWord(word)
    const letters = scrambledWord.value.toLowerCase().split('')

    currentWord.value = letters.map((letter: string) => ({
      letter:"",
      found: true,
    }))

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
    loadingError,
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
    currentWord,
    loadingError,
    nbGoodLetters,
    setFocusCallback,
    cancelGame,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    checkGuessOnInput,
    revealAnagramSolution,
    getWordToGuessLetter,
    areLettersMatching,
    checkAnagramGuessOnInput,
    typeAlert,
    baseHue,
    historyItems,
  }
})
