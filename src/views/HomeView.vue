<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToGuessWord = () => {
  router.push('/guess-word')
}

const goToGuessWordLetters = () => {
  router.push('/guess-word-letters')
}
const goToAnagram = () => {
  router.push('/anagram')
}

const goToFlagsQuiz = () => {
  router.push('/flags-quiz')
}
</script>

<template>
  <v-container max-width="800" class="text-center">
    <v-row density="compact">
      <v-col cols="12">
        <v-card-title class="mt-3 pa-2 mb-3">

          <h1 class="text-h3 mb-5 exo2-light">Bienvenue sur Yumewo</h1>
        </v-card-title>

        <v-card  flat rounded="0" class="pa-6 mb-6" elevation="4">
          <v-card-text>
            <div class="d-flex flex-column gap-6">
              <v-btn size="large" color="primary" @click="goToGuessWord" prepend-icon="mdi-head-dots-horizontal"
                class="justify-start p-4   mb-4">
                Deviner le mot
              </v-btn>
              <v-btn size="large" color="secondary" @click="goToAnagram" prepend-icon="mdi mdi-swap-horizontal"
                class="justify-start p-4   mb-4">
                Trouver l'anagramme
              </v-btn>
              <v-btn size="large" color="primary" @click="goToGuessWordLetters"
                prepend-icon="mdi mdi-alphabetical-variant" class="justify-start p-4   mb-4">
                Pendu
              </v-btn>
              <v-btn size="large" color="success" @click="goToFlagsQuiz" prepend-icon="mdi-flag"
                class="justify-start p-4   mb-4">
                Trouver le drapeau
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>