import { ref } from 'vue'
import type { GameItem } from '@/composables/GameItem'
import { Country, RestCountriesService } from '@/services/restCountriesService'

type AlertType = 'info' | 'success' | 'warning' | 'error'

export function useCountryGameLogic(
  initCallback: (name: string, category: string) => void,
  storageKey: string,
) {
  const userGuess = ref<string>('')
  const message = ref<string>('')
  const typeAlert = ref<AlertType>('warning')
  const isLoading = ref<boolean>(false)
  const isSubmitted = ref<boolean>(false)
  const isGood = ref<boolean>(false)
  const historyItems = ref<GameItem[]>([])
  const countries = ref<Country[]>([])
  const currentCountries = ref<Country[]>([])
  const savedCountry = ref<Country | null>(null)
  const loadingNewGame = ref<boolean>(false)
  const previousCountry = ref<Country | null>(null)
  let autoNextTimer = ref<number | null>(null)
  let inputTry = 0
  let startTime = 0
  let focusCallback: (() => void) | null = null

  function loadhistoryItems() {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      historyItems.value = JSON.parse(saved)
    }
  }

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

  function resethistoryItems() {
    historyItems.value = []
    savehistoryItems()
  }

  function savehistoryItems() {
    // Garde uniquement les 15 premiers éléments
    if (historyItems.value.length > 15) {
      historyItems.value = historyItems.value.slice(0, 15)
    }
    localStorage.setItem(storageKey, JSON.stringify(historyItems.value))
  }

  function defineNewGame(nb: number) {
    if (countries.value.length > 0) {
      const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
      currentCountries.value = shuffled.slice(0, nb)
      currentCountries.value = [...currentCountries.value].sort(() => 0.5 - Math.random())
      savedCountry.value = currentCountries.value[0]!
    }
  }

  function addToHistory(name: string, success: boolean) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    historyItems.value.unshift({
      name: name,
      timeSpent,
      date: new Date().toISOString(),
      success: success,
    })
    savehistoryItems()
  }

  loadhistoryItems()

  return {
    isGood,
    isSubmitted,
    savedCountry,
    previousCountry,
    currentCountries,
    resethistoryItems,
    addToHistory,
    historyItems,
    loadCountries,
    defineNewGame,
  }
}
