import { defineStore } from 'pinia'
import { useWordGameLogic } from '@/composables/useWordGameLogic'
import { fetchRandomWord } from '@/services/wordService'
import { getSynonym } from '@/services/yemewoService'
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
    totalPts,
    nbGames,
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

  const askSynonym = async () => {
    try {
      isLoading.value = true
      const response = await getSynonym(wordToGuess.value)
      if (response.success && response.synonyms.length > 0) {
        message.value = `Synonyme : ${response.synonyms[0]}`
        typeAlert.value = 'info'
      } else {
        message.value = 'Aucun synonyme trouvé'
        typeAlert.value = 'warning'
      }
    } catch (error) {
      message.value = "Erreur lors de la récupération du synonyme"
      typeAlert.value = 'warning'
      console.error('Error fetching synonym:', error)
    } finally {
      isLoading.value = false
    }
  }

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
    askSynonym,
  }
})
