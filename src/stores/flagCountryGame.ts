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
    isSubmitted,
    isLoading,
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
  } = useCountryGameLogic('fagHistoryItems')

  return {
    isSubmitted,
    isLoading,
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
  }
})
