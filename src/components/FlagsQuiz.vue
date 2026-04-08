<template>
    <v-container>
        <v-card v-if="game.savedCountry" class="mt-5 mb-5 pa-4">
            <v-card-title class="mb-2 mt-1 text-center">Trouver le bon drapeau | {{ game.userPts }}
                points</v-card-title>
            <v-card-text class="pa-3" v-if="!game.isLoading">
                <h2 class="mb-5">{{ game.savedCountry.localName }}</h2>
                <v-radio-group v-model="selected">
                    <v-radio class="mb-1" @change="submit" v-for="choice in choices" :key="choice.value"
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

        <div>
            <div v-if="game.previousCountry">
                <v-alert v-if="game.isGood" type="success" class="mb-5">
                    Bonne réponse !
                </v-alert>
                <v-alert v-else type="error" class="mb-5">
                    Mauvaise réponse.
                </v-alert>
            </div>
            <div v-else>
                <v-alert type="info" class="mb-5">
                    Devinez le pays à partir de son drapeau !
                </v-alert>

            </div>
        </div>

        <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFlagCountryStore } from '@/stores/flagCountryGame'
import GuessHistory from '@/components/GuessHistory.vue'

const game = useFlagCountryStore()

const choices = ref<{ label: string; value: string }[]>([])
const selected = ref<string>('')

let autoNextTimer = ref<number | null>(null)

async function loadQuiz() {
    try {
        game.isLoading = true
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
    game.isLoading = true
    game.loadCountries().then(() => {
        loadQuiz()
    })
})
</script>