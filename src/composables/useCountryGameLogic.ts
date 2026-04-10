import { ref } from 'vue'
import { useGameLogic } from '@/composables/useGameLogic'
import { Country, RestCountriesService } from '@/services/restCountriesService'

export function useCountryGameLogic(storageKey: string) {
  const {
    isSubmitted,
    isLoading,
    isGood,
    gameEnd,
    historyItems,
    startTimer,
    addToHistory,
    resetHistory,
    loadHistory,
    addPts,
    incNbGames,
    initRound,
    nbGames,
    userPts,
  } = useGameLogic(storageKey)

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

  function defineNewGame(nb: number) : boolean {
    isSubmitted.value = false
    isGood.value = false
    previousCountry.value = null
    savedCountry.value = null
    startTimer()

    if (countries.value.length > 0) {
      // Shuffle the countries and take the first 'nb' countries for the current game
      const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
      currentCountries.value = shuffled.slice(0, nb)

      const filteredCountries = currentCountries.value.filter(a => a.alreadyUsed == false);
      if (filteredCountries.length == 0){
        currentCountries.value = [];
        gameEnd.value = true;
        return false
      }

      // Save the first country of the current game to display its flag and use it for validation
      savedCountry.value = filteredCountries[0]!
      savedCountry.value.alreadyUsed = true;
      const index = countries.value.findIndex(a => a.name == savedCountry.value?.name);
      if (index > 0 && countries.value[index]){
        countries.value[index].alreadyUsed = true;
      }
      currentCountries.value = [...currentCountries.value].sort(() => 0.5 - Math.random())
      return true
    }

    return false
  }

  loadHistory(4)

  return {
    isSubmitted,
    isLoading,
    isGood,
    gameEnd,
    previousCountry,
    currentCountries,
    savedCountry,
    historyItems,
    addToHistory,
    resetHistory,
    loadCountries,
    defineNewGame,
    addPts,
    incNbGames,
    initRound,
    userPts,
    nbGames,
  }
}
