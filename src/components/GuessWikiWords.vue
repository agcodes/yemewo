<!-- src/components/RandomArticle.vue -->
<template>
  <div>
    <h2 class="mb-4 fs130">Trouvez le mot</h2>

    <div v-if="errorOccurred">
      <div class="card mb-4">
        <div class="card-body">
          <p>Erreur rencontrée</p>
          <button class="btn btn-primary" @click="loadGuess">Recharger</button>
        </div>
      </div>
    </div>

    <div v-if="guessLoaded == false">
      <div class="card mb-4">
        <div class="card-body">Chargement...</div>
      </div>
    </div>

    <div class="mb-4" v-if="randomArticle">
      <div>
        <div v-if="guessLoaded">
          <div v-if="mode == 'anagram' || mode == 'anagram-2'" class="card mb-4">
            <div class="card-body">{{ randomArticle.scrambledContent }}...</div>
          </div>

          <div v-if="mode == 'words'" class="mb-4 d-flex flex-wrap">
            <div class="card">
              <div class="card-body"></div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <!-- Barre de progression -->
          <div v-if="nbGuesses > 0" class="progress mb-4">
            <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }" :aria-valuenow="progress"
              aria-valuemin="0" aria-valuemax="100" :title="progress + '%'"></div>
          </div>

          <div v-if="feedback" class="mb-4 alert" :class="feedbackClass">
            {{ feedback }}
          </div>
          <div v-if="nbGuesses > 0" class="mb-4">
            {{ nbGoodGuesses }} / {{ nbGuesses }}
          </div>
          <div v-if="scores.length > 0" class="mb-4">
            <p>Précédents scores</p>
            <ol>
              <li v-for="(score, index) in scores" :key="index" class="me-4">
                {{ score }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <p><button class="btn btn-link" @click="loadGuess">Passer</button></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  scrambleArticleContent,
  maskTitleWordsInContent,
  fetchTopWikipediaArticles,
  getArticle,
  getSuffleWords,
} from "@/services/wikiService";
import type { Article } from "@/services/wikiService"; // Assurez-vous que le chemin est correct
import { useRequestLimitStore } from "@/stores/requestLimit";
export default defineComponent({
  name: "GuessWikiWords",
  setup() {
    const route = useRoute();
    const mode = ref<string>("");
    const words = ref<string[] | null>(null);
    const articles = ref<Article[] | null>(null);
    const randomArticle = ref<Article | null>(null);
    const userGuess = ref<string>("");
    const feedback = ref<string>("");
    const errorOccurred = ref<boolean>(false);
    const showContent = ref<boolean>(false);
    const showSoluce = ref<boolean>(false);
    const nbGoodGuesses = ref<number>(0);
    const nbGuesses = ref<number>(0);
    const nbMaxGuesses = ref<number>(10);
    const nbTrophees = ref<number>(0);

    const feedbackClass = ref<string>("");
    const articlesLoaded = ref<boolean>(false);
    const guessLoaded = ref<boolean>(false);
    const selectedArticles = ref<Article[]>([]);
    const scores = ref<string[]>([]);
    const requestLimitStore = useRequestLimitStore();
    const limit = 150;

    const canMakeRequest = computed(() => {
      return requestLimitStore.canMakeRequest(limit);
    });

    const progress = computed(() => {
      return calcProgress();
    });

    const calcProgress = () => {
      return (nbGoodGuesses.value / nbMaxGuesses.value) * 100;
    };

    const shuffleArray = (array: Article[]): Article[] => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (newArray[j] && newArray[i]) {
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
      }
      return newArray;
    };

    const initGuess = () => {
      nbGoodGuesses.value = 0;
      nbGuesses.value = 0;
      nbTrophees.value = 0;
      feedbackClass.value = "alert-info";
      if (scores.value.length == 0) {
        feedback.value = "Choisir un article parmi les propositions";
      } else {
        feedback.value = `Round ${scores.value.length + 1}. Choisir un article parmi les propositions`;
      }
    };

    const loadGuess = async () => {
      errorOccurred.value = false;
      showContent.value = false;
      showSoluce.value = false;
      guessLoaded.value = false;

      if (requestLimitStore.canMakeRequest(limit) == false) {
        errorOccurred.value = true;
        return;
      }

      try {
        if (nbGuesses.value == nbMaxGuesses.value) {
          if (calcProgress() > 70) {
            nbTrophees.value++;
          }

          scores.value.push(`${Math.floor(calcProgress())} %`);

          initGuess();
        }

        requestLimitStore.incrementRequestCount();

        if (
          !articlesLoaded.value ||
          !articles.value ||
          articles.value.length < 10
        ) {
          initGuess();
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 2);
          const year = yesterday.getFullYear();
          const month = String(yesterday.getMonth() + 1).padStart(2, "0");
          const day = String(yesterday.getDate()).padStart(2, "0");

          const formattedDate = `${year}/${month}/${day}`;
          fetchTopWikipediaArticles(formattedDate, 500, 30)
            .then((topArticles) => {
              articles.value = topArticles;
              articlesLoaded.value = true;
              loadArticles(0);
            })
            .catch((error) => {
              articlesLoaded.value = false;
              errorOccurred.value = true;
            });
        } else {
          loadArticles(0);
        }
      } catch (error) {
        errorOccurred.value = true;
        console.error("Failed to get random article:", error);
      }
    };

    const loadArticles = (index: number) => {
      if (articles.value && articles.value.length > 0) {
        guessLoaded.value = false;
        selectedArticles.value = [];
        randomArticle.value = null;

        const randomIndex = Math.floor(Math.random() * articles.value.length);

        if (!articles.value[randomIndex]) {
          errorOccurred.value = true;
          return;
        }
        getArticle(articles.value[randomIndex])
          .then((data) => {
            if (articles.value && articles.value.length > 0) {
              const article = data;
              if (
                articles.value != null &&
                article &&
                article.content &&
                article.content.length > 0
              ) {
                article.content = maskTitleWordsInContent(
                  article.content,
                  article.title
                );

                words.value = getSuffleWords(article.content, 18);

                if (article.content.length > 500) {
                  article.content = article.content.substring(0, 500);
                }

                article.scrambledContent = scrambleArticleContent(
                  article.content
                );

                randomArticle.value = article;

                // remove article
                articles.value.splice(randomIndex, 1);
                article.originalTitle = article.title;
                if (mode.value == "anagram-2") {
                  article.title = scrambleArticleContent(article.title);
                }
                selectedArticles.value.push(randomArticle.value);

                getOtherArticles();
              } else if (index < 2) {
                console.log("reload");
                index++;
                loadArticles(index);
              } else {
                errorOccurred.value = true;
              }
            } else {
              errorOccurred.value = true;
            }
          })
          .catch((error) => {
            errorOccurred.value = true;
          });
      }
    };

    const getOtherArticles = () => {
      if (articles.value && articles.value.length > 0) {
        const nbOtherArticles = 4;
        for (let i = 0; i < nbOtherArticles && articles.value.length > 0; i++) {
          // get random article in articles
          const randomIndex = Math.floor(Math.random() * articles.value.length);

          if (!articles.value[randomIndex]) {
            errorOccurred.value = true;
            return;
          }
          getArticle(articles.value[randomIndex])
            .then((article2) => {
              if (article2 && article2.title) {
                article2.originalTitle = article2.title;
                if (mode.value == "anagram-2") {
                  article2.title = scrambleArticleContent(article2.title);
                }

                // add to articles
                selectedArticles.value.push(article2);
                if (selectedArticles.value.length == nbOtherArticles) {
                  guessLoaded.value = true;
                  selectedArticles.value = shuffleArray(selectedArticles.value);
                  selectedArticles.value = shuffleArray(selectedArticles.value);
                }
              }
            })
            .catch((error) => {
              errorOccurred.value = true;
            });
        }
      }
    };

    const toggleContentVisibility = () => {
      showContent.value = !showContent.value;
    };

    const toggleSoluceVisibility = () => {
      showSoluce.value = !showSoluce.value;
    };

    const compareArticle = (article: Article) => {
      if (randomArticle.value) {
        nbGuesses.value++;
        if (randomArticle.value.article === article.article) {
          feedback.value = `Correct ! ${randomArticle.value.originalTitle}`;
          nbGoodGuesses.value++;
          feedbackClass.value = "alert-success";
        } else {
          feedback.value = `Incorrect ! Solution : ${randomArticle.value.originalTitle}`;
          feedbackClass.value = "alert-danger";
        }
      }

      loadGuess();
    };

    onMounted(() => {
      mode.value = "words";
      initGuess();
      loadGuess();
    });

    return {
      loadGuess,
      compareArticle,
      toggleContentVisibility,
      toggleSoluceVisibility,
      initGuess,
      randomArticle,
      selectedArticles,
      userGuess,
      showContent,
      showSoluce,
      feedback,
      feedbackClass,
      guessLoaded,
      progress,
      errorOccurred,
      nbTrophees,
      nbMaxGuesses,
      nbGoodGuesses,
      nbGuesses,
      scores,
      words,
      mode,
    };
  },
});
</script>
<style scoped>
.card {
  line-height: 2rem;
}

.card-words {
  line-height: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
</style>
