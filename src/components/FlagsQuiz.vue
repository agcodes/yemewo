<template>
    <v-container>

        <v-card v-if="game.savedCountry" class="mb-3">
            <v-card-text class="pa-4">
                <h1 class="card-title mb-3">Trouver le bon drapeau</h1>
                <h2 class="mb-3">{{ game.savedCountry.localName }}</h2>
                <v-radio-group v-model="selected">
                    <v-radio @change="submit" v-for="choice in choices" :key="choice.value" :value="choice.value"
                        color="primary">
                        <template v-slot:label>
                            <v-img :src="choice.value" width="70" height="70" max-width="70" max-height="70"
                                eager></v-img>
                        </template>
                    </v-radio>
                </v-radio-group>
            </v-card-text>
        </v-card>
        <v-alert v-else type="error">Failed to load quiz.</v-alert>

        <div>
            <v-card class="mb-3">
                <v-card-text class="pa-4" v-if="game.previousCountry">
                    <h2 class="mb-3">{{ game.previousCountry.localName }}</h2>
                    <div v-if="game.isGood" class="pa-3 mb-2 bg-success text-white">
                        Bonne réponse !
                    </div>
                    <div v-else class="pa-3 mb-2 bg-error text-white">
                        Mauvaise réponse.
                        La réponse était : <v-img :src="game.previousCountry.flag" width="70" height="70" max-width="70"
                            max-height="70" eager></v-img>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <GuessHistory :historyItems="game.historyItems" :onReset="game.resethistoryItems" title="Historique des mots" />
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
        game.defineNewGame(5);
        choices.value = game.currentCountries.map((country) => ({
            label: country.localName,
            value: country.flag,
        }))
    } catch (error) {
        console.error(error)
    }
}

function submit() {
    game.submit(selected.value)

    autoNextTimer.value = setTimeout(() => {
        newQuiz()
    }, 3000)
}

function newQuiz() {
    game.savedCountry = null
    choices.value = []
    selected.value = ''
    game.isSubmitted = false
    game.isGood = false
    game.previousCountry = null
    loadQuiz()
}

onMounted(() => {
    game.loadCountries().then(() => {
        loadQuiz()
    })
})
</script>