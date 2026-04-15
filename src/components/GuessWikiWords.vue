<!-- src/components/RandomArticle.vue -->
<template>
  <div>
    <div v-if="game.loadingError">
      <div class="card mb-4">
        <div class="card-body">
          <p>Erreur rencontrée</p>
          <button class="btn btn-primary" @click="initRound">Recharger</button>
        </div>
      </div>
    </div>

    <div v-if="game.isLoading == false">
      <div class="card mb-4">
        <div class="card-body">Chargement...</div>
      </div>
    </div>

    <div class="mb-4" v-if="game.randomArticle">
      <div v-if="game.isLoading">
        <div v-if="game.words" class="mb-4 d-flex flex-wrap">
          <div class="card border-0 mb-4 p-4">
            <div class="card-title text-center mt-2 fs130 mb-3">
              Trouvez l'article correspondant aux mots suivants
            </div>
            <div class="card-body">
              <div v-if="game.words" class="mb-4 d-flex flex-wrap">
                <div class="card">
                  <div class="card-body">
                    <div class="card-words">
                      <span v-for="(word, index) in game.words" :key="index" class="me-4 word">
                        {{ word }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="game.isLoading" class="mb-4">
                <div class="btn-group d-flex flex-wrap">
                  <button v-for="(article, index) in game.selectedArticles" :key="index"
                    class="btn btn btn-outline-info m-2 btn-expressive" @click="game.submit(article)">
                    {{ article.title }}
                  </button>
                </div>
              </div>

              <transition name="alert-transition">
                <div v-if="game.message" class="alert mb-4" :class="`alert-${game.typeAlert}`">
                  {{ game.message }}
                </div>
              </transition>

              <div class="mb-2">
                <button class="btn btn-outline-primary me-2" @click="loadQuiz">Passer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <!-- Barre de progression 
          <div v-if="nbGuesses > 0" class="progress mb-4">
            <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }" :aria-valuenow="progress"
              aria-valuemin="0" aria-valuemax="100" :title="progress + '%'"></div>
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
          -->
      </div>
    </div>
    <!-- Historique -->
    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useWikiGameStore } from '@/stores/wikiGame'
const game = useWikiGameStore()

import GuessHistory from '@/components/GuessHistory.vue'

// Mise à jour du temps en temps réel
let timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const alertKey = ref(0);

async function loadQuiz() {
  try {
    game.loadGuess();
  } catch (error) {
    game.isLoading = false
  }
}

function initRound() {
  game.initRound()
  game.isLoading = true
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

onMounted(() => {
  initRound();
  loadQuiz();
})
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