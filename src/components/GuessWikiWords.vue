<!-- src/components/RandomArticle.vue -->
<template>
  <div>
    <h2 class="mb-4 fs130">Trouvez le mot</h2>

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
      <div>
        <div v-if="game.isLoading">
          <div v-if="game.words" class="mb-4 d-flex flex-wrap">
            <div class="card">
              <div class="card-body">
                <div v-if="game.words" class="mb-4 d-flex flex-wrap">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-words">
                        <!-- Affiche la liste des mots -->
                        <span
                          v-for="(word, index) in game.words"
                          :key="index"
                          class="me-4 word"
                        >
                          {{ word }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="game.isLoading" class="mb-4">
                  <!-- Boutons pour les articles sélectionnés -->
                  <div class="btn-group d-flex flex-wrap">
                    <button
                      v-for="(article, index) in game.selectedArticles"
                      :key="index"
                      class="btn btn btn-outline-info m-2 btn-expressive"
                      @click="game.submit(article)"
                    >
                      {{ article.title }}
                    </button>
                  </div>
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

          <div v-if="game.message" class="mb-4 alert">
            {{ game.message }}
          </div>
        </div>
      </div>
    </div>

    <p><button class="btn btn-link" @click="loadQuiz">Passer</button></p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useWikiGameStore } from '@/stores/wikiGame'
const game = useWikiGameStore()

import GuessHistory from '@/components/GuessHistory.vue'

const choices = ref<{ label: string; value: string }[]>([])
const selected = ref<string>('')

let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Clé pour forcer la transition des alertes

const rounds = ref<number>(0)

// Temps écoulé
const elapsedTime = ref<string>('00:00')

// Mise à jour du temps en temps réel
let timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

function updateElapsedTime() {
  if (!game.startTime) {
    elapsedTime.value = '00:00'
    return
  }
  const now = new Date().getTime()
  const diff = now - game.startTime
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / 1000 / 60)
  elapsedTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

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

function newQuiz() {
  choices.value = []
  selected.value = ''
  loadQuiz().then(() => {

  })
}

function initRound() {
  rounds.value += 1;
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

