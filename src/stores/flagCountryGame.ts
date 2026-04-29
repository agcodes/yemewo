import { defineStore } from 'pinia'
import { useCountryGameLogic } from '@/composables/useCountryGameLogic'

export const useFlagCountryStore = defineStore('flagCountryGame', () => {
  function submit(selected: string) {
    if (!savedCountry.value) return

    clearTimer()
    isSubmitted.value = true
    isGood.value = selected === savedCountry.value.flagSvg
    previousCountry.value = savedCountry.value

    incNbRoundGames()
    
    if (isGood.value) {
      addRoundPts(1)

      if (nbRoundGames.value == 5 && roundPts.value == 5) {
        message.value = 'Bien joué !'
      } else if (nbRoundGames.value == 9 && roundPts.value == 9) {
        message.value = 'Incroyable ! Encore une bonne réponse !'
      } else if (
        nbRoundGames.value == gamesPerRound.value &&
        roundPts.value == gamesPerRound.value
      ) {
        message.value = 'Magnifique ! Vous êtes un expert des drapeaux !'
      } else {
        message.value = 'Bonne réponse !'
      }
      typeAlert.value = 'success'
    } else {
      message.value = 'Mauvaise réponse.'
      typeAlert.value = 'danger'
    }
    
    addToHistory(savedCountry.value.localName, isGood.value)

    if (isEndOfGame()) {
      gamesPerRound.value = nbRoundGames.value
      message.value = `Fin du jeu !`
      typeAlert.value = 'info'
      addRound()
    } else {
      if (nbRoundGames.value == gamesPerRound.value) {
        message.value += " Début d'un nouveau round..."
      } else {
        message.value += " Chargement d'un nouveau pays..."
      }
    }
  }

  const {
    init,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resetHistory,
    addToHistory,
    loadCountries,
    nbRoundGames,
    incNbRoundGames,
    isEndOfGame,
    initRound,
    addRound,
    nbRounds,
    roundPts,
    gameRounds,
    gamesPerRound,
    addRoundPts,
    defineNewGame,
    startTime,
    startTimer,
    timerInterval,
    clearTimer,
    elapsedTime,
    updateElapsedTime,
  } = useCountryGameLogic('fagHistoryItems')

  return {
    init,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    submit,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resetHistory,
    loadCountries,
    defineNewGame,
    nbRoundGames,
    initRound,
    nbRounds,
    gameRounds,
    roundPts,
    startTime,
    startTimer,
    timerInterval,
    clearTimer,
    elapsedTime,
    updateElapsedTime,
  }
})
