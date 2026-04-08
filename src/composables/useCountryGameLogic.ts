import { ref } from 'vue'
import { useGameLogic } from '@/composables/useGameLogic'
import { Country, RestCountriesService } from '@/services/restCountriesService'

export function useCountryGameLogic(storageKey: string) {
  const { historyItems, startTimer, addToHistory, resetHistory, loadHistory, addPts, userPts } =
    useGameLogic(storageKey)

  const isSubmitted = ref(false)
  const isGood = ref(false)
  const isLoading = ref(false)
  const countries = ref<Country[]>([])
  const currentCountries = ref<Country[]>([])
  const savedCountry = ref<Country | null>(null)
  const previousCountry = ref<Country | null>(null)

  async function loadCountries() {
    try {
      const service = new RestCountriesService(
        'https://restcountries.com/v3.1/all?fields=name,translations,flags',
        false,
      )
      const randomCountries = await service.getCountries()
      if (!randomCountries || randomCountries.length === 0) {
        throw new Error('Something went wrong!')
      }

      countries.value = randomCountries
    } catch (error) {
      console.error(error)
    }
  }

  function defineNewGame(nb: number) {
    isSubmitted.value = false
    isGood.value = false
    previousCountry.value = null
    savedCountry.value = null

    if (countries.value.length > 0) {
      const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
      currentCountries.value = shuffled.slice(0, nb)
      savedCountry.value = currentCountries.value[0]!
      currentCountries.value = [...currentCountries.value].sort(() => 0.5 - Math.random())
    }
  }

  loadHistory()
  return {
    isSubmitted,
    previousCountry,
    isGood,
    currentCountries,
    savedCountry,
    historyItems,
    addToHistory,
    isLoading,
    resetHistory,
    loadCountries,
    defineNewGame,
    addPts,
    userPts,
  }
}
