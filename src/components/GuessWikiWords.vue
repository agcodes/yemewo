<!-- src/components/RandomArticle.vue -->
<template>
  <div class="row">
    <div class="col-12 col-md-9">
      <div v-if="game.loadingError">
        <div class="card mb-4">
          <div class="card-body">
            <p>Erreur rencontrée</p>
            <button class="btn btn-primary" @click="initRound">Recharger</button>
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="game.isLoading" key="loading" class="card border-0 mb-5 p-5">
          Chargement
        </div>
        <div v-else-if="game.randomArticle" key="content" class="mb-4">
          <div v-if="game.words" class="mb-4 d-flex flex-wrap">
            <div class="card border-0 mb-4 p-4">
              <div class="card-title text-center mt-2 fs130 mb-3">
                Trouvez l'article correspondant aux mots suivants
              </div>
              <div class="card-body">
                <div v-if="game.words" class="mb-4 d-flex flex-wrap">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-words p-2">
                        <span v-for="(word, index) in game.words" :key="index" class="me-4 word">
                          {{ word }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="!game.isLoading" class="mb-4">
                 <transition name="alert-transition" mode="out-in">
                  <div v-if="game.message" :key="game.message" class="alert mb-4" :class="`alert-${game.typeAlert}`">
                    {{ game.message }}
                  </div>

                </transition>


                  <div class="btn-group d-flex flex-wrap">
                    <button v-for="(article, index) in game.selectedArticles" :key="index"
                       :class="{
                        good: game.isSubmitted && game.isGood && article.good,
                        bad: game.isSubmitted && !game.isGood && article.good
                      }"
                      class="btn btn btn-outline-info m-2 btn-expressive" @click="game.submit(article)">
                      
                      {{ article.title }}
                    </button>
                  </div>
                </div>
                <div class="mb-2">
                  <button class="btn btn-outline-primary me-2" @click="loadQuiz">Passer</button>
                </div>
              </div>
            </div>
          </div>
      </div>
      </transition>
    </div>
    <div class="col-12 col-md-3">
      <!-- Score -->
      <ScoreDisplay :game="game" />

      <!-- Historique -->
      <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import GuessHistory from '@/components/GuessHistory.vue'
import { useWikiGameStore } from '@/stores/wikiGame'
const game = useWikiGameStore()

const alertKey = ref(0);
watch(
  () => [game.message],
  () => {
    alertKey.value++;
  },
  { deep: true }
);

onBeforeUnmount(() => {
 game.clearTimer();
})

async function loadQuiz() {
  try {
    game.loadGuess()
    game.clearTimer()
    game.updateElapsedTime()
  } catch (error) {
    
  }
}

function initRound() {
  game.initRound()
  game.clearTimer()
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.good {
  border: 1px solid green;
  font-style: italic;
}
.bad {
  border: 1px solid orange;
  font-style: italic;
}
</style>
