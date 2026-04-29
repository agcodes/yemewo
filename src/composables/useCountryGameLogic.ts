import { ref } from 'vue'
import { useGameLogic } from '@/composables/useGameLogic'
import { Country, RestCountriesService } from '@/services/restCountriesService'
import { API_CONFIG } from '@/config/apiConfig'

export function useCountryGameLogic(storageKey: string) {
  const {
    init,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    historyItems,
    startTimer,
    startTime,
    timerInterval,
    clearTimer,
    addToHistory,
    resetHistory,
    loadHistory,
    addRoundPts,
    addRound,
    incNbRoundGames,
    initRound,
    nbRounds,
    gameRounds,
    nbRoundGames,
    roundPts,
    elapsedTime,
    gamesPerRound,
    updateElapsedTime,
  } = useGameLogic(storageKey)

  const countries = ref<Country[]>([])
  const currentCountries = ref<Country[]>([])
  const savedCountry = ref<Country | null>(null)
  const previousCountry = ref<Country | null>(null)

  async function loadCountries(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      loadingError.value = false

      const service = new RestCountriesService(API_CONFIG.REST_COUNTRIES_URL, false)
      service
        .getCountries()
        .then((randomCountries) => {
          countries.value = randomCountries
          resolve(true)
        })
        .catch((error) => {
          loadingError.value = true
          message.value = 'Erreur lors de la récupération du quiz'
          typeAlert.value = 'warning'
          reject(message.value)
        })
    })
  }

  function isEndOfGame(): boolean {
    if (countries.value.filter((a) => a.alreadyUsed == false).length == 0) {
      gameEnd.value = true
      return true
    }
    return false
  }

  async function defineNewGame(
    nb: number,
    reload: boolean,
  ): Promise<{ label: string; value: string }[]> {
    isSubmitted.value = false
    isGood.value = false
    previousCountry.value = null
    savedCountry.value = null
    currentCountries.value = []
    isLoading.value = true
    gamesPerRound.value = 10

    if (reload) {
      gameRounds.value = []
      nbRounds.value = 1
      await loadCountries()
    }

    if (isEndOfGame()) {
      currentCountries.value = []
      savedCountry.value = null
      isLoading.value = false
      return []
    }

    if (nbRoundGames.value >= 10) {
      initRound()
      message.value = `Début d'un nouveau round !`
    } else {
      message.value = `Chargement d'un nouveau pays...`
    }

    if (countries.value.length > 0) {
      // Shuffle the countries and take the first 'nb' countries for the current game
      const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
      const filteredCountries = shuffled.filter((a) => a.alreadyUsed == false)
      // Save the first country of the current game to display its flag and use it for validation
      savedCountry.value = filteredCountries[0]!
      savedCountry.value.alreadyUsed = true
      const index = countries.value.findIndex((a) => a.name == savedCountry.value?.name)
      if (index > 0 && countries.value[index]) {
        countries.value[index].alreadyUsed = true
      }

      const selectedCountries = shuffled
        .filter((a) => a.name != savedCountry.value?.name)
        .slice(0, nb - 1)

      currentCountries.value = [...selectedCountries].sort(() => 0.5 - Math.random())
      currentCountries.value.push(savedCountry.value)
      currentCountries.value = [...currentCountries.value].sort(() => 0.5 - Math.random())
      isLoading.value = false
      
      message.value = 'Devinez le pays à partir de son drapeau'
      return currentCountries.value.map((country) => ({
        label: country.localName,
        value: country.flagSvg,
      }))
    }

    startTimer()
    isLoading.value = false
    return []
  }

  init()
  loadHistory(4)

  return {
    init,
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
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
    isEndOfGame,
    addRoundPts,
    incNbRoundGames,
    initRound,
    addRound,
    startTimer,
    roundPts,
    nbRounds,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
    startTime,
    timerInterval,
    clearTimer,
    updateElapsedTime,
    elapsedTime,
  }
}
