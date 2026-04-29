import { ref } from 'vue'
import type { GameItem } from '@/composables/GameItem'
import type { GameRound } from './GameRound'

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'danger' | undefined

export function useGameLogic(storageKey: string) {
  const historyItems = ref<GameItem[]>([])
  const gameRounds = ref<GameRound[]>([])
  const roundPts = ref<number>(0)
  const totalPts = ref<number>(0)
  const gamesPerRound = ref<number>(2)
  const nbRoundGames = ref<number>(0)
  const nbRounds = ref<number>(0)
  const historyLimit = ref<number>(5)
  const loadingError = ref(false)
  const isSubmitted = ref(false)
  const isGood = ref(false)
  const isLoading = ref(false)
  const gameEnd = ref(false)
  const message = ref<string>('')
  const typeAlert = ref<AlertType>('warning')
  const loadingNewGame = ref<boolean>(false)
  const elapsedTime = ref<string>('00:00')
  const startTime = ref<number>(0)
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

  function init() {
    gameRounds.value = []
    nbRoundGames.value = 0
    nbRounds.value = 0
    roundPts.value = 0
    totalPts.value = 0
    gameEnd.value = false
    isSubmitted.value = false
    isGood.value = false
    isLoading.value = false
    loadingError.value = false
    message.value = ''
    initRound();
  }

  function startTimer() {
    startTime.value = new Date().getTime()
    clearTimer()
    timerInterval.value = setInterval(updateElapsedTime, 1000)
  }

  function clearTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  function updateElapsedTime() {
    if (!startTime.value) {
      elapsedTime.value = '00:00'
      return
    }
    const now = new Date().getTime()
    const diff = now - startTime.value
    const seconds = Math.floor(diff / 1000) % 60
    const minutes = Math.floor(diff / 1000 / 60)
    elapsedTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  function incNbRoundGames() {
    nbRoundGames.value += 1
  }

  function addRoundPts(points: number) {
    roundPts.value += points
  }

  function getLevel() {
    if (roundPts.value == 0) {
      return 0
    }

    if (roundPts.value / gamesPerRound.value > 0.9) {
      return 3
    }

    if (roundPts.value / gamesPerRound.value >= 0.7) {
      return 2
    }

    return 1
  }

  function addRound() {
    if (nbRoundGames.value > 0) {
      gameRounds.value.push({
        index: nbRounds.value,
        nbPts: roundPts.value,
        level: getLevel(),
      })
    }
  }

  function initRound() {
    gameEnd.value = false
    totalPts.value += roundPts.value

    // add previous round to history
    addRound()
    nbRoundGames.value = 0
    nbRounds.value += 1
    roundPts.value = 0
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

  return {
    init,
    isSubmitted,
    isLoading,
    loadingError,
    message,
    typeAlert,
    isGood,
    gameEnd,
    totalPts,
    nbRounds,
    nbRoundGames,
    gameRounds,
    loadingNewGame,
    historyItems,
    startTimer,
    startTime,
    timerInterval,
    clearTimer,
    addToHistory,
    loadHistory,
    resetHistory,
    addRoundPts,
    addRound,
    incNbRoundGames,
    initRound,
    elapsedTime,
    updateElapsedTime,
    roundPts: roundPts,
    gamesPerRound,
  }
}
