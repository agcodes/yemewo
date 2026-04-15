<template>
  <div class="row">
    <div class="col-12 col-md-8">
      <div v-if="game.loadingError" class="alert mb-5" :class="`alert-${game.typeAlert}`">
        <p class="mb-4">{{ game.message }}</p>
        <button class="btn btn-outline-secondary" @click="initRound">
          Recharger
        </button>
      </div>

      <div v-else-if="game.gameEnd === true" class="card rounded-0 mb-5 p-4">
        <div class="alert alert-info mb-4">
          <i class="bi bi-info-circle me-2"></i>
          Fin du jeu
        </div>

        <button class="btn btn-outline-primary" @click="initRound">
          Nouveau jeu
        </button>
      </div>

      <div v-if="game.savedCountry" class="card border-0 mb-4 p-4">
        <div class="card-title text-center mt-2 fs130 mb-3">
          Jeu des drapeaux
        </div>

        <div class="card-body">
          <transition name="alert-transition" mode="out-in">
            <div class="mb-5 mt-1" :key="alertKey">
              <div v-if="game.previousCountry && game.isGood" class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                Bonne réponse ! Chargement d'un nouveau pays...
              </div>

              <div v-else-if="game.previousCountry && !game.isGood" class="alert alert-danger">
                <i class="bi bi-x-circle me-2"></i>
                Mauvaise réponse. Chargement d'un nouveau pays...
              </div>

              <div v-else-if="!game.isLoading" class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Devinez le pays à partir de son drapeau
              </div>
            </div>
          </transition>

          <h2 class="mb-4">
            {{ game.savedCountry.localName }}
          </h2>

          <!-- Choix des drapeaux -->
          <div class="row">
            <div v-for="(choice, index) in choices" :key="index" class="col-12 col-sm-6 mb-4">
              <div :class="{
                good: game.isSubmitted && game.isGood && choice.value === game.savedCountry.flagSvg,
                bad: game.isSubmitted && !game.isGood && choice.value === game.savedCountry.flagSvg
              }" class="card p-3 bg-highlight flag-border" role="button" @click="clickFlag(choice.value)">
                <img :src="choice.value" class="img-fluid rounded mb-3  bg-highlight"
                  style="height:150px; object-fit:contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4">
      <!-- Score -->
      <div class="card border-0 mb-4 p-5 bg-highlight">
        <h6 class="fw-medium mb-2">
          <i class="bi bi-star me-2"></i>
          Votre score
        </h6>

        <div class="text-center p-4">
          <div class="fs-2 fw-black mb-2">
            {{ game.userPts }} / {{ game.nbGames }}
          </div>
          <div class="text-muted">
            Temps : {{ elapsedTime }}
          </div>
        </div>
      </div>

      <!-- History -->
      <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useFlagCountryStore } from '@/stores/flagCountryGame'
const game = useFlagCountryStore()

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

onMounted(() => {
  timerInterval.value = setInterval(updateElapsedTime, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const alertKey = ref(0);
// Surveillance des changements de game.isGood ou game.previousCountry
watch(
  () => [game.isGood, game.previousCountry],
  () => {
    alertKey.value++; // Change la clé pour déclencher la transition
  },
  { deep: true }
);

async function loadQuiz() {
  try {
    game.defineNewGame(4);
    if (game.currentCountries.length > 0) {
      choices.value = game.currentCountries.map((country) => ({
        label: country.localName,
        value: country.flagSvg,
      }))
      game.isLoading = false
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
      updateElapsedTime();
      timerInterval.value = setInterval(updateElapsedTime, 1000)
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
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  autoNextTimer.value = setTimeout(() => {
    newQuiz()
  }, 3000)
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

  game.loadCountries().then(() => {
    loadQuiz()
  })
}

onMounted(() => {
  initRound();
})
</script>