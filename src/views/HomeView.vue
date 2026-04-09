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
        <h1 class="text-h3 mb-8">Bienvenue sur Yumewo</h1>

        <v-card rounded="lg" class="pa-6 mb-6" elevation="4">
          <v-card-title class="text-h5 mb-4">Jeux disponibles</v-card-title>
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

        <v-alert type="info" class="text-left">
          <strong>Devinette de mots :</strong> Devinez le mot caché grâce aux couleurs des lettres.<br>
          <strong>Anagrammes :</strong> Réarrangez les lettres mélangées pour former le mot correct.<br>
          <strong>Pendu :</strong> Devinez le mot lettre par lettre avant que le pendu ne soit complet.<br>
          <strong>Quiz des drapeaux :</strong> Devinez le pays à partir de son drapeau.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>