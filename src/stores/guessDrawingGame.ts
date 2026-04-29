import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/services/wikiService'
import { useWordGameLogic, type WordLetter } from '@/composables/useWordGameLogic'
import { loadSvg as loadSvgFromService, loadIcons, getRandomKeyword } from '@/services/svgService'
import type { Word } from '@/composables/Word'

export const useGuessDrawingGameStore = defineStore('guessDrawingGame', () => {
  const mdiIcons = ref<Word[]>([])
  const svgString = ref<string>('')

  const initCallback = (word: Word) => {
    message.value = 'Devinez le mot anglais.'
  }

  const initIcons = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      loadIcons()
        .then((icons) => {
          mdiIcons.value = icons
          resolve()
        })
        .catch((error) => {
          mdiIcons.value = []
          reject()
        })
    })
  }

  const getWord = async (): Promise<Word> => {
    return new Promise((resolve, reject) => {
      const word: Word = getRandomKeyword(mdiIcons.value)

      loadSvg(word.value).then((svgTxt: string) => {
        svgString.value = svgTxt
        resolve(word)
      })
    })
  }

  const loadSvg = async (keyword: string): Promise<string> => {
    return loadSvgFromService(keyword)
  }

  const {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingError,
    wordLetters,
    loadingNewGame,
    userLetters,
    nbGoodLetters,
    triggerFocusCallBack,
    validateGuess,
    setFocusCallback,
    cancelGame,
    discardWord,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    checkGuessOnInput,
    revealSolution,
    getWordToGuessLetter,
    wordFound,
    typeAlert,
    baseHue,
    historyItems,
  } = useWordGameLogic(initCallback, 'guesswordlettershistoryItems', getWord)

  return {
    wordToGuess,
    hintGuess,
    userGuess,
    message,
    isLoading,
    loadingError,
    wordLetters,
    loadingNewGame,
    userLetters,
    nbGoodLetters,
    setFocusCallback,
    cancelGame,
    resetHistory,
    initGame,
    getLetterColor,
    checkGuess,
    cancelAutoNext,
    revealSolution,
    getWordToGuessLetter,
    wordFound,
    checkGuessOnInput,
    typeAlert,
    baseHue,
    historyItems,
    mdiIcons,
    initIcons,
    loadSvg,
    svgString,
  }
})
