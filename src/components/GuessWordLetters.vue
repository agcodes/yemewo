<template>
    <v-alert v-if="game.loadingError" :type="game.typeAlert" class="mb-5">
        {{ game.message }}
        <v-btn @click="initGame" variant="outlined">
            Recharger
        </v-btn>
    </v-alert>

    <v-card variant="flat" v-else rounded="0" class="ma-0 mt-5 mb-4 pa-5">
        <v-card-title class="text-center mb-4">

            Devinez le mot lettre par lettre
        </v-card-title>
        <v-card-text v-if="!game.isLoading">
            <div class="d-flex justify-center gap-2 mb-5">
                <transition-group name="word-letter" tag="div" class="d-flex justify-center gap-2">
                    <v-sheet v-for="(letter, index) in game.wordLetters" :key="letter.letter + index" width="65"
                        height="65" class="d-flex align-center justify-center text-h4" elevation="2"
                        :class="{ 'letter-found': letter.found && !game.wordFound }"
                        :style="{ backgroundColor: game.getLetterColor(letter.letter) }">
                        <span>
                            {{
                                letter.found || game.wordFound
                                    ? letter.letter.toUpperCase()
                                    : ''
                            }}
                        </span>
                    </v-sheet>
                </transition-group>
            </div>

            <div class="d-flex justify-center gap-2 mb-5">
                <v-responsive class="mx-auto" max-width="255">
                    <v-text-field ref="guessInput" max-width="" v-model="game.userLetterGuess" append-icon="mdi-send"
                        prepend-icon="icon" clear-icon="mdi-close-circle" label="lettre" maxlength="1" glow single-line
                        type="text" variant="filled" placeholder="lettre" clearable
                        @keyup.enter="game.checkLetterGuessOnInput"
                        @click:append="game.checkLetterGuessOnInput"></v-text-field>
                </v-responsive>
            </div>

            <div class="d-flex justify-center gap-2 mb-5">
                <transition-group name="letter" tag="div" class="d-flex justify-center gap-2">
                    <v-sheet v-for="(letter, index) in game.userLetters.filter(a => !a.found)"
                        :key="letter.letter + index" width="65" height="65"
                        class="d-flex align-center justify-center text-h4 mb-5" elevation="2">
                        <span>
                            {{
                                letter.letter.toUpperCase()
                            }}
                        </span>
                    </v-sheet>
                </transition-group>
            </div>

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
            </div>

            <transition name="alert-transition">
                <v-alert v-if="game.message" :key="game.message" :type="game.typeAlert" class="mb-5">
                    {{ game.message }}
                    <v-btn v-if="game.loadingNewGame" @click="game.cancelAutoNext" variant="outlined">
                        Annuler
                    </v-btn>
                </v-alert>
            </transition>
        </v-card-text>
    </v-card>

    <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
</template>


<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { useGameStore } from '@/stores/guessWordLettersGame'
import { onMounted, ref } from 'vue'

const game = useGameStore()
const guessInput = ref<HTMLElement | null>(null)

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
