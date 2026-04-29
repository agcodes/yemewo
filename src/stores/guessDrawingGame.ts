import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWordGameLogic, type WordLetter } from '@/composables/useWordGameLogic'
import { loadSvg as loadSvgFromService, loadIcons, getRandomKeyword } from '@/services/svgService'
import type { Word } from '@/composables/Word'

export const useGuessDrawingGameStore = defineStore('guessDrawingGame', () => {
  const mdiIcons = ref<Word[]>([])
  const svgString = ref<string>('')

  const initCallback = () => {
    if (nbRoundGames.value >= gamesPerRound.value) {
      initRound()
      message.value = `Début d'un nouveau round !`
    } else {
      message.value = 'Devinez le mot anglais.'
    }
  }

  const initIcons = async (): Promise<void> => {
     gameEnd.value = false
    return new Promise((resolve, reject) => {
      loadIcons()
        .then((icons) => {
          mdiIcons.value = icons
          resolve()
        })
        .catch((error) => {
          mdiIcons.value = []
          reject(error)
        })
    })
  }

  const getWord = async (): Promise<Word> => {
    return new Promise((resolve, reject) => {
      if (mdiIcons.value.length == 0){
        reject("no words");
        gameEnd.value = true
        message.value = `Fin du jeu !`
        typeAlert.value = 'info'
      }
      const word: Word = getRandomKeyword(mdiIcons.value)
      // Remove the icon if its value matches word.value
      mdiIcons.value = mdiIcons.value.filter((icon) => icon.value !== word.value);
      loadSvg(word.value).then((svgTxt: string) => {
        svgString.value = svgTxt
        resolve(word)
      }).catch((error)  => {
        reject(error)
      })
    })
  }

  const loadSvg = async (keyword: string): Promise<string> => {
    return loadSvgFromService(keyword)
  }

  const {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    nbRounds,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
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
    gameEnd
  } = useWordGameLogic(initCallback, 'guessDrawingGamehistoryItems', getWord)

  return {
    startTime,
    updateElapsedTime,
    elapsedTime,
    initRound,
    addRound,
    roundPts,
    nbRounds,
    gameRounds,
    nbRoundGames,
    gamesPerRound,
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
    gameEnd
  }
})
