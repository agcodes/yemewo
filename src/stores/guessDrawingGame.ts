import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/services/wikiService'
import { useWordGameLogic, type WordLetter } from '@/composables/useWordGameLogic'
import { loadSvg as loadSvgFromService, loadIcons, getRandomKeyword } from '@/services/svgService'
import type { Word } from '@/composables/Word'

export const useGuessDrawingGameStore = defineStore('guessDrawingGame', () => {
  const mdiIcons = ref<Word[]>([])
  const svgString = ref<string>('');

  const initCallback = (word: Word) => {
     message.value = "Devinez le mot anglais."
  }

  const initIcons = async (): Promise<void> => {
      return new Promise((resolve, reject) => {
        loadIcons().then((icons) => {
            mdiIcons.value = icons;
            resolve()
          })
          .catch ((error) => {
          console.error('Failed to initialize icons:', error)
          mdiIcons.value = []
          reject()
        });
    });
  }

  const getWord = async (): Promise<Word> => {
    return new Promise((resolve, reject) => {
        const word: Word = getRandomKeyword(mdiIcons.value);
        
        loadSvg(word.value).then((svgTxt: string) => {
          svgString.value = svgTxt;
          resolve(word);
        });
    })
  }

  const loadSvg = async (keyword: string): Promise<string> => {
    return loadSvgFromService(keyword)
  }
/*
  function checkDrawingGuessOnInput() {
     if (!userGuess.value) return
     const userGuessValue = userGuess.value.toLowerCase()
    const wordToGuessValue = wordToGuess.value.toLowerCase()
    if (userGuessValue === wordToGuessValue) {
      message.value = 'Bravo ! Vous avez trouvé le mot. Nouveau mot dans 3 secondes...'
      typeAlert.value = 'success'
      wordFound.value = true
      return true
    } else if (wordFound.value === false) {
      typeAlert.value = 'info'
      
        let correctLetters = 0
        for (let i = 0; i < userGuessValue.length && i < wordToGuessValue.length; i++) {
          if (userGuessValue[i] === wordToGuessValue[i]) {
            correctLetters++
          }
        }
        nbGoodLetters.value = correctLetters
        message.value = `Vous avez trouvé ${correctLetters} sur ${wordToGuessValue.length} lettres.`
      
      return false
    }
    return false
  }*/

  function submit(article: Article) {}

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
    svgString
  }
})
