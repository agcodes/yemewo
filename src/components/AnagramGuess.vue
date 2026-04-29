<template>
    <!-- Erreur de chargement -->
    <div v-if="game.loadingError" class="alert mb-4" :class="`alert-${game.typeAlert}`">
        {{ game.message }}
        <button class="btn btn-outline-secondary ms-2" @click="initGame">
            Recharger
        </button>
    </div>

    <!-- Carte principale -->
    <div v-else class="card border-0 mb-5 p-3">
        <div class="card-body">
            <!-- Message -->
            <transition name="alert-transition">
                <div v-if="game.message" class="alert mb-4" :class="`alert-${game.typeAlert}`">
                    {{ game.message }}
                </div>
            </transition>
            <!-- Mot mélangé -->
            <div class="d-flex justify-content-center mt-1 gap-2 mb-3">
                <div v-for="(letter, index) in game.scrambledWord" :key="index"
                    class="d-flex align-items-center text-black justify-content-center fs-4 shadow-primary" :style="{
                        width: '65px',
                        height: '65px',
                        backgroundColor: game.wordFound
                            ? game.getLetterColor(game.getWordToGuessLetter(index))
                            : game.getLetterColor(letter)
                    }">
                    {{ letter.toUpperCase() }}
                </div>
            </div>

            <!-- Mot en cours -->
            <div class="d-flex justify-content-center gap-2 mb-5">
                <div v-for="(letter, index) in game.currentWord" :key="index"
                    class="d-flex align-items-center text-black justify-content-center fs-4 shadow-primary text-uppercase"
                    :style="{
                        width: '65px',
                        height: '65px',
                        backgroundColor: !letter.found
                            ? 'red'
                            : game.getLetterColor(letter.letter)
                    }">
                    {{
                        game.wordFound
                            ? game.wordToGuess[index]?.toUpperCase()
                            : letter.letter.toUpperCase()
                    }}
                </div>
            </div>

            <!-- Champ de saisie -->
            <div class="d-flex justify-content-center mb-5">
                <div style="max-width:344px;">
                    <label class="form-label">
                        Votre proposition
                    </label>
                    <input ref="guessInput" v-model="game.userGuess" type="text"
                        class="form-control shadow-primary rounded-0 form-control-lg text-uppercase"
                        placeholder="Saisir un mot" :maxlength="game.wordToGuess.length" :disabled="game.isLoading"
                        @input="game.checkAnagramGuessOnInput" @keyup.enter="game.checkAnagramGuessOnInput" />
                </div>
            </div>
            <!-- Indice -->
            <div class="alert alert-light mb-4">
                Indice : {{ game.hintGuess }}
            </div>

            <!-- Actions -->
            <div class="gap-3 mb-2  btn-group">
                <button class="btn btn-outline-primary" @click="displayNewWord">
                    Passer
                </button>

                <button v-if="game.wordFound === false && !game.isLoading && !game.loadingNewGame"
                    class="btn btn-warning" @click="game.revealAnagramSolution">
                    Solution
                </button>

                <button v-if="game.loadingNewGame" class="btn btn-outline-secondary" @click="game.cancelAutoNext">
                    Annuler
                </button>
            </div>
        </div>
    </div>

    <!-- Historique -->
    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
</template>


<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useAnagramGameStore } from '@/stores/anagramGame'
import { onMounted, ref, watch } from 'vue'

const game = useAnagramGameStore()
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
