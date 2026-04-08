<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card v-if="game.savedCountry" class="mt-5 mb-5 pa-4">
  
          <v-card-title class="d-flex align-center pa-2">
            <div class="d-flex align-center text-h5 font-weight-bold">
              <v-icon color="primary" class="mr-2">mdi-flag-variant</v-icon>
              <span>Trouver le bon drapeau</span>
              
            </div>
          </v-card-title>


      <v-card-text class="pa-3" v-if="!game.isLoading">
          <h2 class="mb-5">{{ game.savedCountry.localName }}</h2>
          <v-radio-group v-model="selected">
              <v-radio class="mb-2" @change="submit" v-for="choice in choices" :key="choice.value"
                  :value="choice.value" color="primary">
                  <template v-slot:label>
                      <v-img :src="choice.value" class="flag-border rounded mb-2" :class="{
                          good: game.isSubmitted && game.isGood && choice.value === game.savedCountry.flagSvg,
                          bad: game.isSubmitted && !game.isGood && choice.value === game.savedCountry.flagSvg
                      }" width="100" height="auto" max-width="100"></v-img>

                      <span class="ml-3" v-if="game.isSubmitted && choice.value === game.savedCountry.flagSvg">{{
                          game.savedCountry.localName }}</span>
                  </template>
              </v-radio>
          </v-radio-group>
      </v-card-text>

  </v-card>

  <v-alert v-else-if="!game.isLoading" type="error">Failed to load quiz.</v-alert>
        </v-col>

        <v-col cols="12" md="4">

          <v-card v-if="game.savedCountry" class="mt-5 mb-5 pa-4">

  <!-- Transition pour les alertes -->
  <transition name="alert-transition" mode="out-in">
    <div :key="alertKey">
      <v-alert
        v-if="game.previousCountry && game.isGood"
        type="success"
        class="mb-1"
        variant="tonal"
        density="comfortable"
      >
        <template v-slot:prepend>
          <v-icon>mdi-check-circle</v-icon>
        </template>
        Bonne réponse !
      </v-alert>

      <v-alert
        v-else-if="game.previousCountry && !game.isGood"
        type="error"
        class="mb-1"
        variant="tonal"
        density="comfortable"
      >
        <template v-slot:prepend>
          <v-icon>mdi-close-circle</v-icon>
        </template>
        Mauvaise réponse
      </v-alert>

      <v-alert
        v-else-if="!game.isLoading "
        type="info"
        class="mb-"
        variant="tonal"
        density="comfortable"
      >
        <template v-slot:prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        Devinez le pays à partir de son drapeau !
      </v-alert>
    </div>
  </transition>

<div>
  {{ game.userPts }} / {{  game.nbGames }}
</div>
          </v-card>
       <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
           </v-col>
      </v-row>

      
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useFlagCountryStore } from '@/stores/flagCountryGame'
import GuessHistory from '@/components/GuessHistory.vue'

const game = useFlagCountryStore()

const choices = ref<{ label: string; value: string }[]>([])
const selected = ref<string>('')

let autoNextTimer = ref<number | null>(null)

  // Clé pour forcer la transition des alertes
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
        game.defineNewGame(5);
        choices.value = game.currentCountries.map((country) => ({
            label: country.localName,
            value: country.flagSvg,
        }))
        game.isLoading = false
    } catch (error) {
        console.error(error)
    }
}

function submit() {
    if (game.isSubmitted) return
    game.submit(selected.value)

    autoNextTimer.value = setTimeout(() => {
        newQuiz()
    }, 3000)
}

function newQuiz() {
    choices.value = []
    selected.value = ''
    loadQuiz()
}

onMounted(() => {
    game.initRound()
    game.isLoading = true
    game.loadCountries().then(() => {
        loadQuiz()
    })
})
</script>