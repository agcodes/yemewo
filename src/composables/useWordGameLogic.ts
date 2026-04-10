import { ref } from 'vue'
import { fetchRandomWord } from '@/services/wordService'
import { useGameLogic } from '@/composables/useGameLogic'

type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface WordLetter {
  letter: string
  found: boolean
}

export function useWordGameLogic(
  initCallback: (word: string, category: string) => void,
  storageKey: string,
) {
  const { historyItems, startTimer, addToHistory, resetHistory, loadHistory, addPts, userPts } =
    useGameLogic(storageKey)

  const wordToGuess = ref<string>('')
  const hintGuess = ref<string>('')
  const userGuess = ref<string>('')
  const message = ref<string>('')
  const typeAlert = ref<AlertType>('warning')
  const isLoading = ref<boolean>(false)
  const wordLetters = ref<WordLetter[]>([])
  const userLetters = ref<WordLetter[]>([])

  const baseHue = ref<number>(Math.floor(Math.random() * 360))
  const wordFound = ref<boolean>(false)
  const loadingNewGame = ref<boolean>(false)

  let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  let inputTry = 0
  let focusCallback: (() => void) | null = null

  // calculate the color for a letter based on its position in the alphabet and the base hue
  function getLetterColor(letter: string): string {
    if (!letter || letter == '-' || letter == "'" || letter == ' ') return 'hsl(0, 0%, 90%)'
    // Remove accents from the letter
    const normalizedLetter = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const position = normalizedLetter.toLowerCase().charCodeAt(0) - 96 // a=1, b=2, etc.
    const hue = (baseHue.value + (360 / 26) * (position - 1)) % 360
    return `hsl(${hue}, 80%, 70%)`
  }

  async function initGame() {
    isLoading.value = true
    try {
      const randomWord = await fetchRandomWord()
      wordToGuess.value = randomWord.name
      hintGuess.value = randomWord.categorie

      const letters = randomWord.name.toLowerCase().split('')
      wordLetters.value = letters.map((letter) => ({
        letter,
        found: letter === '-' || letter === "'" || letter === ' ',
      }))

      userLetters.value = Array(9)
        .fill(null)
        .map(() => ({ letter: '', found: false }))
      userGuess.value = ''

      inputTry = 0
      typeAlert.value = 'info'
      baseHue.value = Math.floor(Math.random() * 360)
      startTimer()

      initCallback(randomWord.name, randomWord.categorie)

      wordFound.value = false
      loadingNewGame.value = false
      if (focusCallback) {
        setTimeout(focusCallback, 100) // Délai pour s'assurer que le DOM est prêt
      }
    } catch (error) {
      message.value = 'Erreur lors de la récupération du mot'
    } finally {
      isLoading.value = false
    }
  }

  function getWordToGuessLetter(index: number): string {
    if (typeof wordToGuess.value[index] === 'undefined') {
      return ''
    }
    if (!wordToGuess.value || index < 0 || index >= wordToGuess.value.length) {
      return ''
    }
    return wordToGuess.value[index].toUpperCase()
  }

  function setFocusCallback(callback: () => void) {
    focusCallback = callback
  }

  function checkGuess() {
    if (userGuess.value.toLowerCase() === wordToGuess.value.toLowerCase()) {
      message.value = 'Bravo ! Vous avez trouvé le mot.'
    } else {
      message.value = "Ce n'est pas le bon mot, essayez encore !"
    }
  }

  function revealSolution() {
    discardWord(`La solution est : ${wordToGuess.value}. Nouveau mot dans 3 secondes...`)
  }

  function discardWord(messageToShow: string) {
    message.value = messageToShow
    typeAlert.value = 'warning'
    userGuess.value = wordToGuess.value
    wordFound.value = true
    timeOutNewWord()
    addToHistory(wordToGuess.value, false)
  }

  function timeOutNewWord() {
    loadingNewGame.value = true
    // new game after 3 seconds
    autoNextTimer.value = setTimeout(() => {
      initGame()
    }, 3000)
  }

  function checkGuessOnInput() {
    inputTry++
    const userGuessValue = userGuess.value.trim().toLowerCase()
    validateGuess(userGuessValue)
  }

  function validateGuess(userGuessValue: string): boolean {
    const wordToGuessValue = wordToGuess.value.toLowerCase()
    if (userGuessValue === wordToGuessValue) {
      message.value = 'Bravo ! Vous avez trouvé le mot. Nouveau mot dans 3 secondes...'
      typeAlert.value = 'success'
      wordFound.value = true
      addPts(10)
      addToHistory(wordToGuess.value, true)
      timeOutNewWord()
      return true
    } else if (wordFound.value === false) {
      typeAlert.value = 'warning'
      if (inputTry >= 200) {
        message.value = `Vous avez dépassé les 200 tentatives. Encore un petit effort !`
      } else {
        let correctLetters = 0
        for (let i = 0; i < userGuessValue.length && i < wordToGuessValue.length; i++) {
          if (userGuessValue[i] === wordToGuessValue[i]) {
            correctLetters++
          }
        }
        message.value = `Vous avez trouvé ${correctLetters} sur ${wordToGuessValue.length} lettres.`
      }
      return false
    }
    return false
  }

  function cancelAutoNext() {
    if (autoNextTimer.value) {
      clearTimeout(autoNextTimer.value)
      autoNextTimer.value = null
      loadingNewGame.value = false
      message.value =
        'Le mot suivant a été annulé. Vous pouvez cliquer sur "Nouveau mot" pour passer au suivant.'
    }
  }

  function cancelGame() {
    addToHistory(wordToGuess.value, false)
    initGame()
  }

  loadHistory(8)

  return {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingNewGame,
    wordFound,
    wordLetters,
    userLetters,
    setFocusCallback,
    cancelGame,
    discardWord,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    revealSolution,
    checkGuessOnInput,
    getWordToGuessLetter,
    validateGuess,
    typeAlert,
    baseHue,
    historyItems,
  }
}
