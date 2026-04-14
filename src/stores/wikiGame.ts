import { defineStore } from 'pinia'
import { useWikiGameLogic } from '@/composables/useWikiGameLogic'
import type { Article } from '@/services/wikiService'

export const useWikiGameStore = defineStore('wikiGame', () => {
  function submit(article: Article) {
    if (randomArticle.value) {
        console.log(article.title);
        incNbGames();
        if (randomArticle.value.article === article.article) {
            message.value = `Correct ! ${randomArticle.value.originalTitle}`;
        
        } else {
            message.value = `Incorrect ! Solution : ${randomArticle.value.originalTitle}`;
        }
    }
  }

  const {
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    historyItems,
    resetHistory,
    addToHistory,
    nbGames,
    incNbGames,
    loadGuess,
    initRound,
    userPts,
    addPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words
  } = useWikiGameLogic('wikiHistoryItems')

  return {
    message,
    typeAlert,
    isSubmitted,
    isLoading,
    loadingError,
    isGood,
    gameEnd,
    submit,
    historyItems,
    resetHistory,
    loadGuess,
    nbGames,
    initRound,
    userPts,
    startTime,
    randomArticle,
    selectedArticles,
    articles,
    words
  }
})
