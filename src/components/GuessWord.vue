<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useGameStore } from '@/stores/guessWordGame'
import { onMounted, ref } from 'vue'

const game = useGameStore()
const guessInput = ref<HTMLElement | null>(null)

onMounted(() => {
    game.setFocusCallback(focusInput);
    game.initGame()
})

const focusInput = () => {
    guessInput.value?.focus()
}

const displayNewWord = () => {
    game.cancelGame()
}
</script>

<template>
    <v-card class="mt-5 mb-5 pa-5">
        <v-card-title class="mb-5 mt-1 text-center">Devinez le mot</v-card-title>
        <v-card-text>
            <div class="d-flex justify-center gap-2 mb-5">
                <v-sheet v-for="(letter, index) in game.wordToGuess" :key="index" width="65" height="65"
                    class="d-flex align-center justify-center text-h4" elevation="2"
                    :style="{ backgroundColor: game.getLetterColor(letter) }">
                    <span>
                        {{
                            game.wordFound
                                ? letter.toUpperCase()
                                : (((index === 0 || game.wordToGuess[index] == '-') && !game.userGuess[index])
                                    ? game.getWordToGuessLetter(index) // display the first letter of the word to guess
                                    : (game.userGuess[index] ? game.userGuess[index].toUpperCase() : ''))
                        }}
                    </span>
                </v-sheet>
            </div>

            <v-responsive class="mx-auto mb-5" max-width="344">
                <v-text-field ref="guessInput" class="text-h4" placeholder="saisir un mot"
                    :maxlength="game.wordToGuess.length" glow single-line v-model="game.userGuess" density="comfortable"
                    label="Votre proposition" @input="game.checkGuessOnInput" @keyup.enter="game.checkGuessOnInput"
                    :disabled="game.isLoading" />
            </v-responsive>

            <v-alert v-if="game.message" :type="game.typeAlert" class="mb-5">
                {{ game.message }}
            </v-alert>

            <v-alert class="mb-5">
                Indice : {{ game.hintGuess }}
            </v-alert>

            <div class="mb-5">
                <v-btn @click="displayNewWord" class="mr-2" variant="outlined">
                    Nouveau mot
                </v-btn>
                <v-btn v-if="game.wordFound === false && game.isLoading == false && game.loadingNewGame == false"
                    @click="game.revealSolution" class="mr-2" variant="tonal" color="warning">
                    Solution
                </v-btn>
                <v-btn v-if="game.loadingNewGame" @click="game.cancelAutoNext" variant="outlined">
                    Annuler
                </v-btn>
            </div>
        </v-card-text>
    </v-card>

    <GuessHistory :historyItems="game.historyItems" :onReset="game.resethistory" title="Historique des mots" />
</template>
