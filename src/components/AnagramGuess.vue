<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useAnagramGameStore } from '@/stores/anagramGame'
import { onMounted, ref } from 'vue'

const game = useAnagramGameStore()
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
    <v-card rounded="0" class="mt-5 mb-5 pa-5">
        <v-card-title class="mb-5 mt-1 text-center">Anagramme</v-card-title>
        <v-card-text>
            <div class="d-flex justify-center gap-2 mb-5">
                <v-sheet v-for="(letter, index) in game.scrambledWord" :key="index" width="65" height="65"
                    class="d-flex align-center justify-center text-h4" elevation="2"
                    :style="{ backgroundColor: game.wordFound ? game.getLetterColor(game.getWordToGuessLetter(index)) : game.getLetterColor(letter) }">
                    <span>
                        {{
                            game.wordFound
                                ? game.wordToGuess[index]?.toUpperCase()
                                : letter.toUpperCase()
                        }}
                    </span>
                </v-sheet>
            </div>

            <v-responsive class="mx-auto mb-5" max-width="344">
                <v-text-field ref="guessInput" class="text-h3" :maxlength="game.wordToGuess.length" glow single-line
                    v-model="game.userGuess" density="comfortable" label="Votre proposition"
                    @input="game.checkGuessOnInput" @keyup.enter="game.checkGuessOnInput" :disabled="game.isLoading" />
            </v-responsive>

            <v-alert v-if="game.message" :type="game.typeAlert" class="mb-5">
                {{ game.message }}
            </v-alert>

            <v-alert class="mb-5">
                Indice : {{ game.hintGuess }}
            </v-alert>

            <div class="d-flex gap-3 mb-5">
                <v-btn @click="displayNewWord" class="mr-2" variant="outlined">
                    Nouveau mot
                </v-btn>
                <v-btn v-if="game.wordFound === false && game.isLoading == false && game.loadingNewGame == false"
                    @click="game.revealAnagramSolution" class="mr-2" variant="tonal" color="warning">
                    Solution
                </v-btn>
                <v-btn v-if="game.loadingNewGame" @click="game.cancelAutoNext" variant="outlined">
                    Annuler
                </v-btn>
            </div>
        </v-card-text>
    </v-card>

    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
</template>
