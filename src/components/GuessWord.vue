<template>
    <!-- Erreur de chargement -->
    <div v-if="game.loadingError" class="alert mb-5" :class="`alert-${game.typeAlert}`" role="alert">
        {{ game.message }}
        <button class="btn btn-outline-secondary ms-2" @click="initGame">
            Recharger
        </button>
    </div>

    <!-- Carte principale -->
    <div v-else class="card border-0 mb-5 p-3">
        <div class="card-body">
            <!-- game message -->
            <transition name="alert-transition">
                <div v-if="game.message" class="alert mb-4" :class="`alert-${game.typeAlert}`">
                    {{ game.message }}
                </div>
            </transition>

            <!-- Lettres du mot -->
            <div class="d-flex justify-content-center gap-2 mb-5">
                <div v-for="(letter, index) in game.wordToGuess" :key="index"
                    class="d-flex align-items-center text-black justify-content-center word-letter shadow-primary  text-uppercase fs-4"
                    :style="{
                        backgroundColor: game.getLetterColor(letter)
                    }">
                    <span>
                        {{
                            game.wordFound
                                ? letter.toUpperCase()
                                : (
                                    ((index === 0 || game.wordToGuess[index] === '-') && !game.userGuess[index])
                                        ? game.getWordToGuessLetter(index)
                                        : (game.userGuess[index] ? game.userGuess[index].toUpperCase() : '')
                                )
                        }}
                    </span>
                </div>
            </div>

            <!-- input text -->
            <div class="d-flex justify-content-center mb-5">
                <div style="max-width: 344px;">
                    <label class="form-label">
                        Votre proposition
                    </label>
                    <input ref="guessInput" v-model="game.userGuess" type="text"
                        class="form-control form-control-lg rounded-0 text-uppercase shadow-primary"
                        placeholder="Saisir un mot" :maxlength="game.wordToGuess.length" :disabled="game.isLoading"
                        @input="game.checkGuessOnInput" @keyup.enter="game.checkGuessOnInput" />
                </div>
            </div>

            <!-- hint -->
            <div class="alert alert-light mb-4">
                Indice : {{ game.hintGuess }}
            </div>

            <!-- Actions -->
            <div class="mb-2">
                <button class="btn btn-outline-primary me-2" @click="displayNewWord">
                   Passer
                </button>

                <button v-if="game.wordFound === false && !game.isLoading && !game.loadingNewGame"
                    class="btn btn-warning me-2" @click="game.revealSolution">
                    Solution
                </button>

                <button v-if="game.loadingNewGame" class="btn btn-outline-secondary" @click="game.cancelAutoNext">
                    Annuler
                </button>
            </div>
        </div>
    </div>

    <!-- Historique -->
    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
</template>

<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useGameStore } from '@/stores/guessWordGame'
import { onMounted, ref } from 'vue'

const game = useGameStore()
const guessInput = ref<HTMLElement | null>(null)

onMounted(() => {
    initGame()
})

const initGame = () => {
    game.setFocusCallback(focusInput);
    game.initGame()
}

const focusInput = () => {
    guessInput.value?.focus()
}

const displayNewWord = () => {
    game.cancelGame()
}
</script>
