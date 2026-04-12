import { defineStore } from 'pinia'
import { useCountryGameLogic } from '@/composables/useCountryGameLogic'

export const useFlagCountryStore = defineStore('flagCountryGame', () => {
  function submit(selected: string) {
    if (!savedCountry.value) return

    isSubmitted.value = true
    isGood.value = selected === savedCountry.value.flagSvg
    previousCountry.value = savedCountry.value

    if (isGood.value) {
      addPts(1)
    }
    
    incNbGames()
    addToHistory(savedCountry.value.localName, isGood.value)
  }

  const {
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
    nbGames,
    incNbGames,
    initRound,
    userPts,
    addPts,
    defineNewGame,
    startTime,
  } = useCountryGameLogic('fagHistoryItems')

  return {
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
    nbGames,
    initRound,
    userPts,
    startTime,
  }
})
