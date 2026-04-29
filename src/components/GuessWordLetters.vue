<template>
    <!-- loading error -->
    <div v-if="game.loadingError" class="alert mb-4" :class="`alert-${game.typeAlert}`" role="alert">
        {{ game.message }}
        <button class="btn btn-outline-secondary ms-2" @click="initGame">
            Recharger
        </button>
    </div>

    <div v-else class="card border-0 mb-4 p-4">
        <div class="card-title text-center mt-2 fs130 mb-3">
            Devinez le mot lettre par lettre
        </div>

        <div class="card-body" v-if="!game.isLoading">
            <!-- letters -->
            <div class="d-flex justify-content-center mt-1 gap-1 mb-5">
                <transition-group name="word-letter" tag="div" class="d-flex justify-content-center gap-1">
                    <div v-for="(letter, index) in game.wordLetters" :key="letter.letter + index"
                        class="d-flex align-items-center text-black justify-content-center shadow-primary word-letter text-uppercase fs-4"
                        :class="{ 'letter-found': letter.found && !game.wordFound }" :style="{

                            backgroundColor: game.getLetterColor(letter.letter)
                        }">
                        <span>
                            {{
                                letter.found || game.wordFound
                                    ? letter.letter
                                    : ''
                            }}
                        </span>
                    </div>
                </transition-group>
            </div>

            <!-- Input -->
            <div class="d-flex justify-content-center mb-5">
                <div style="max-width:144px;">
                    <div class="input-group">
                        <input ref="guessInput" v-model="game.userLetterGuess" type="text" maxlength="1"
                            class="form-control form-control-lg  rounded-0 text-uppercase" placeholder="Lettre"
                            @keyup.enter="game.checkLetterGuessOnInput" />
                        <button class="btn btn-outline-secondary" @click="game.checkLetterGuessOnInput">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center mb-5">
                <transition-group name="letter" tag="div" class="d-flex justify-content-center gap-1 flex-wrap">
                    <div v-for="(letter, index) in game.userLetters.filter(a => !a.found)" :key="letter.letter + index"
                        class="d-flex align-items-center justify-content-center shadow-primary word-letter text-uppercase fs-4">
                        {{ letter.letter }}
                    </div>
                </transition-group>
            </div>

            <div class="alert alert-light mb-4">
                Indice : {{ game.hintGuess }}
            </div>

            <div class="mb-4 btn-group">
                <button class="btn btn-outline-primary me-2" @click="displayNewWord">
                    Nouveau mot
                </button>
                <button v-if="game.wordFound === false && !game.isLoading && !game.loadingNewGame"
                    class="btn btn-warning me-2" @click="game.revealSolution">
                    Solution
                </button>
            </div>

            <transition name="alert-transition" mode="out-in">
                <div v-if="game.message" :key="game.message" class="alert mt-2" :class="`alert-${game.typeAlert}`">
                    {{ game.message }}
                    <button v-if="game.loadingNewGame" class="btn btn-outline-secondary ms-2"
                        @click="game.cancelAutoNext">
                        Annuler
                    </button>
                </div>
            </transition>
        </div>
    </div>

    <!-- Historique -->
    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
</template>

<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useGameStore } from '@/stores/guessWordLettersGame'
import { onMounted, ref, watch } from 'vue'

const game = useGameStore()
const guessInput = ref<HTMLElement | null>(null)

const alertKey = ref(0);
watch(
    () => [game.message],
    () => {
        alertKey.value++;
    },
    { deep: true }
);

onMounted(() => {
    initGame();
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
