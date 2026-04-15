import { ref } from 'vue'
import type { GameItem } from '@/composables/GameItem'

type AlertType = 'info' | 'success' | 'warning' | 'error' | undefined

export function useGameLogic(storageKey: string) {
  const historyItems = ref<GameItem[]>([])
  const userPts = ref<number>(0)
  const nbGames = ref<number>(0)
  const nbRounds = ref<number>(0)
  const historyLimit = ref<number>(10)
  const loadingError = ref(false)
  const isSubmitted = ref(false)
  const isGood = ref(false)
  const isLoading = ref(false)
  const gameEnd = ref(false)
  const message = ref<string>('')
  const typeAlert = ref<AlertType>('warning')
  const loadingNewGame = ref<boolean>(false)

  const startTime = ref<number>(0)

  function startTimer() {
    startTime.value = new Date().getTime()
  }

  function incNbGames() {
    nbGames.value += 1
  }

  function addPts(points: number) {
    userPts.value += points
  }

  function loadHistory(nb: number) {
    historyLimit.value = nb

    const saved = localStorage.getItem(storageKey)
    if (saved) {
      historyItems.value = JSON.parse(saved)
      if (nb !== undefined) {
        historyItems.value = historyItems.value.slice(0, nb)
      }
    }
  }

  function saveHistory() {
    if (historyItems.value.length > 15) {
      historyItems.value = historyItems.value.slice(0, 15)
    }
    localStorage.setItem(storageKey, JSON.stringify(historyItems.value))
  }

  function resetHistory() {
    historyItems.value = []
    saveHistory()
  }

  function initRound() {
    gameEnd.value = false
    nbGames.value = 0
    userPts.value = 0
  }

  function addToHistory(name: string, success: boolean) {
    const timeSpent = Math.floor((new Date().getTime() - startTime.value) / 1000)
    historyItems.value.unshift({
      name,
      timeSpent,
      date: new Date().toISOString(),
      success,
    })
    historyItems.value = historyItems.value.slice(0, historyLimit.value)
  }

  return {
    isSubmitted,
    isLoading,
    loadingError,
    message,
    typeAlert,
    isGood,
    gameEnd,
    loadingNewGame,
    historyItems,
    startTimer,
    startTime,
    addToHistory,
    loadHistory,
    resetHistory,
    addPts,
    incNbGames,
    nbRounds,
    nbGames,
    initRound,
    userPts: userPts,
  }
}
