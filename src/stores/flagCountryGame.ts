import { defineStore } from 'pinia'
import { useCountryGameLogic } from '@/composables/useCountryGameLogic'

export const useFlagCountryStore = defineStore('flagCountryGame', () => {
  const initCallback = (name: string, category: string) => {}

  function submit(selected: string) {
    if (!savedCountry.value) return

    isSubmitted.value = true
    isGood.value = selected === savedCountry.value.flagSvg
    previousCountry.value = savedCountry.value

    if (isGood.value) {
      addPts(10)
    }
    addToHistory(savedCountry.value.localName, isGood.value)
  }

  const {
    isGood,
    isSubmitted,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resetHistory,
    addToHistory,
    loadCountries,
    isLoading,
    userPts,
    addPts,
    defineNewGame,
  } = useCountryGameLogic('fagHistoryItems')

  return {
    isGood,
    isSubmitted,
    submit,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resetHistory,
    loadCountries,
    defineNewGame,
    isLoading,
    userPts,
  }
})
