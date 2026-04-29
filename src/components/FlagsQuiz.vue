<template>
  <div class="row">
    <div class="col-12 col-md-9">
      <div v-if="game.loadingError" class="alert mb-5" :class="`alert-${game.typeAlert}`">
        <p class="mb-4">{{ game.message }}</p>
        <button class="btn btn-outline-secondary" @click="initRound">
          Recharger
        </button>
      </div>

      <div v-if="game.isLoading" class="card border-0 mb-5 p-3">
        Chargement
      </div>
      
      <div v-if="game.savedCountry" class="card border-0 mb-5 p-3">
        <div class="card-body">
          <transition name="alert-transition" mode="out-in">
            <div class="mb-4" :key="alertKey">
              <div v-if="game.gameEnd === true" class="card rounded-0 mb-5 p-4">
                <div class="alert alert-info mb-4">
                  <i class="bi bi-info-circle me-2"></i>
                  Fin du jeu ! Votre score est {{ game.roundPts }} / {{ game.nbRoundGames }}
                </div>

                <button class="btn btn-outline-primary" @click="initRound">
                  Nouveau jeu
                </button>
              </div>

              <div v-if="game.previousCountry && game.message" :class="`alert-${game.typeAlert}`" class="alert">
                <i v-if="game.typeAlert == 'danger'" class="bi bi-x-circle me-2"></i>
                <i v-if="game.typeAlert == 'success'" class="bi bi-check-circle me-2"></i>
                {{ game.message }}
              </div>

              <div v-else-if="!game.isLoading" class="alert alert-info">
                {{ game.message }}
              </div>
            </div>
          </transition>

          <h2 class="mb-4 mt-1">
            {{ game.savedCountry.localName }}
          </h2>

          <!-- Choix des drapeaux -->
          <div class="row">
            <div v-for="(choice, index) in choices" :key="index" class="col-12 col-sm-6 mb-4">
              <div :class="{
                good: game.isSubmitted && game.isGood && choice.value === game.savedCountry.flagSvg,
                bad: game.isSubmitted && !game.isGood && choice.value === game.savedCountry.flagSvg,
                selected: game.isSubmitted && choice.value === selected
              }" class="card p-3 bg-highlight flag-border" role="button" @click="clickFlag(choice.value)">
                <img :src="choice.value" class="img-fluid rounded bg-highlight flag-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-3">
      <ScoreDisplay :game="game" />

      <!-- History -->
      <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFlagCountryStore } from '@/stores/flagCountryGame'
const game = useFlagCountryStore()

import GuessHistory from '@/components/GuessHistory.vue'
import ScoreDisplay from '@/components/ScoreDisplay.vue'

const choices = ref<{ label: string; value: string }[]>([])
const selected = ref<string>('')

let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)

onMounted(() => {
  game.init()
  game.startTimer()
  initRound();
})

onBeforeUnmount(() => {
  game.clearTimer()
})

const alertKey = ref(0);
watch(
  () => [game.isGood, game.previousCountry],
  () => {
    alertKey.value++;
  },
  { deep: true }
);

function initRound() {
  game.initRound()
  game.clearTimer()
  loadQuiz(true)
}

async function loadQuiz(reload: boolean) {
  try {
    choices.value = await game.defineNewGame(4, reload);
    if (choices.value.length > 0) {
      game.isLoading = false
      game.startTimer();
    }
  } catch (error) {
    game.isLoading = false
  }
}

function clickFlag(choice: string) {
  selected.value = choice;
  submit();
}

function submit() {
  if (game.isSubmitted) return
  game.submit(selected.value)

  if (game.gameEnd) {
    return
  }

  autoNextTimer.value = setTimeout(() => {
    newQuiz()
  }, 3000)
}

function newQuiz() {
  choices.value = []
  selected.value = ''
  loadQuiz(false)
}
</script>