import { defineStore } from 'pinia'
import { useCountryGameLogic } from '@/composables/useCountryGameLogic'

export const useFlagCountryStore = defineStore('flagCountryGame', () => {
  const initCallback = (name: string, category: string) => {}

  function submit(selected: string) {
    if (!savedCountry.value) return

    isGood.value = selected === savedCountry.value.flag
    isSubmitted.value = true
    previousCountry.value = savedCountry.value

    addToHistory(savedCountry.value.localName, isGood.value)
  }

  const {
    isGood,
    isSubmitted,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resethistoryItems,
    addToHistory,
    loadCountries,
    defineNewGame,
  } = useCountryGameLogic(initCallback, 'fagHistoryItems')

  return {
    isGood,
    isSubmitted,
    submit,
    savedCountry,
    previousCountry,
    currentCountries,
    historyItems,
    resethistoryItems,
    loadCountries,
    defineNewGame,
  }
})
