<template>
  <v-container>
    <v-row class="mt-2">
      <v-col cols="12" md="8" >
        <v-card rounded="" class="mb-5 pa-8" v-if="game.gameEnd == true" >
          <v-alert type="info" class="mb-4" variant="tonal" density="comfortable">
              <template v-slot:prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              Fin du jeu
            </v-alert>

            <div class="mb-5">
                <v-btn @click="initRound" class="mr-2" variant="outlined">
                    Nouveau jeu
                </v-btn>
            </div>
        </v-card>

        <v-card rounded="0" class="mb-5 pa-8" v-if="game.savedCountry" >
          <v-card-title class="d-flex align-center pa-2 mb-3">
            <div class="d-flex align-center text-h4 font-weight-bold exo2-light">
              <span class=" font-weight-black  exo2-light">Jeu des drapeaux</span>
            </div>
          </v-card-title>

          <!-- Transition pour les alertes -->
          <transition name="alert-transition" mode="out-in">
            <div class="mb-6" :key="alertKey">
              <v-alert v-if="game.previousCountry && game.isGood" type="success" class="mb-2" variant="tonal"
                density="comfortable">
                <template v-slot:prepend>
                  <v-icon>mdi-check-circle</v-icon>
                </template>
                Bonne réponse ! Chargement d'un nouveau pays...
              </v-alert>

              <v-alert v-else-if="game.previousCountry && !game.isGood" type="error" class="mb-2" variant="tonal"
                density="comfortable">
                <template v-slot:prepend>
                  <v-icon>mdi-close-circle</v-icon>
                </template>
                Mauvaise réponse. Chargement d'un nouveau pays...
              </v-alert>

              <v-alert v-else-if="!game.isLoading" type="info" class="mb-2" variant="tonal" density="comfortable">
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                Devinez le pays à partir de son drapeau !
              </v-alert>
            </div>
          </transition>

          <h2 class="mb-6 font-weight-black primary-text">{{ game.savedCountry.localName }}</h2>

          <v-row class="">
              <v-col v-for="(choice, index) in choices" :key="index" cols="12" sm="6">
                <v-card
                  flat 
                  outlined
                  rounded="0"
                  :class="['pa-4 option-card bg-highlight']"
                  @click="clickFlag(choice.value)"
                >
                  <v-img :src="choice.value" height="150" contain 
                  class="flag-border rounded mb-2 bg-highlight" :class="{
                    good: game.isSubmitted && game.isGood && choice.value === game.savedCountry.flagSvg,
                    bad: game.isSubmitted && !game.isGood && choice.value === game.savedCountry.flagSvg
                  }"
              
                  ></v-img>

                  <div class="d-flex align-center bg-highlight justify-space-between">
                   
                    <v-radio-group v-model="selected" hide-details class="ma-0 pa-0">
                      <v-radio @change="submit" :value="index" class="bg-highlight"></v-radio>
                    </v-radio-group>
                    <span v-if="game.isSubmitted && choice.value === game.savedCountry.flagSvg" class="font-weight-bold">
                      {{  game.savedCountry.localName }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
        </v-card>

        <v-alert v-else-if="!game.isLoading" type="error">Failed to load quiz.</v-alert>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="0" class="mb-6 pa-4 bg-highlight">
          <v-card-title class="text-h6 font-weight-medium">
            <v-icon class="mr-2">mdi-star</v-icon>
            Votre score
        </v-card-title>
          <div class="text-center pa-6">
            <div class="text-h3 font-weight-black mb-2"> {{ game.userPts }} / {{ game.nbGames }}</div>
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

let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Clé pour forcer la transition des alertes
const alertKey = ref(0);
const rounds = ref<number>(0)

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
   if (game.currentCountries.length > 0){
      choices.value = game.currentCountries.map((country) => ({
        label: country.localName,
        value: country.flagSvg,
      }))
      game.isLoading = false
    }
  } catch (error) {
    game.isLoading = false
  }
}

function clickFlag(choice : string){
  selected.value = choice;
  submit();
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

function initRound(){
  rounds.value += 1;
  game.initRound()
  game.isLoading = true
  game.loadCountries().then(() => {
    loadQuiz()
  })
}

onMounted(() => {
 initRound();
})
</script>