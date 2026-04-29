import { defineStore } from 'pinia'
import { useWordGameLogic, type WordLetter } from '@/composables/useWordGameLogic'
import { ref } from 'vue'
import { fetchRandomWord } from '@/services/wordService'

export const useGameStore = defineStore('guessWordLettersGame', () => {
  const userLetterGuess = ref<string>('')

  const initCallback = () => {
    if (nbRoundGames.value >= gamesPerRound.value) {
      initRound()
      message.value = `Début d'un nouveau round !`
    } else {
       message.value = 'Deviner le mot en saisissant une lettre'
    }
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

    if (wordLettersString === wordToGuess.value.toLowerCase()) {
      validateGuess(wordLettersString)
      return true
    }

    if (!userLetter) {
      if (!found) {
        // Trouver la première position vide (letter = "")
        const emptyIndex = userLetters.value.findIndex((l) => l.letter === '');
        
        if (emptyIndex !== -1) {
          // Remplacer la première lettre vide par la nouvelle lettre
          userLetters.value[emptyIndex] = { letter, found: found };
        }

        if (userLetters.value.filter((l) => l.letter != '').length == 8){
          message.value += ". Attention, il ne vous reste qu'une erreur !"
          typeAlert.value="warning"
        }

        if (userLetters.value.filter((l) => l.letter != '').length == 9) {
          discardWord(`Vous avez dépassé les 9 essais ! Le mot était : ${wordToGuess.value}.`)
        }
      } 
    }
   
    triggerFocusCallBack()
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
    wordLetters,
    loadingNewGame,
    userLetters,
    nbGoodLetters,
    triggerFocusCallBack,
    validateGuess,
    setFocusCallback,
    cancelGame,
    discardWord,
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
  } = useWordGameLogic(initCallback, 'guesswordlettershistoryItems', fetchRandomWord)

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
    userLetterGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingError,
    wordLetters,
    loadingNewGame,
    userLetters,
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
    checkLetterGuessOnInput,
    wordFound,
    checkGuessOnInput,
    typeAlert,
    baseHue,
    historyItems,
  }
})
