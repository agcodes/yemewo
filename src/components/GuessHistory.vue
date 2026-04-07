<script setup lang="ts">
import type { FoundWord } from '@/composables/useGameLogic'

interface Props {
    foundWords: FoundWord[]
    onReset: () => void
    title?: string
}

withDefaults(defineProps<Props>(), {
    title: 'Historique'
})
</script>

<template>
    <v-card class="mt-5 mb-5" v-if="foundWords.length > 0">
        <v-card-title class="text-h6 font-weight-medium">
            {{ title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-list lines="two" density="comfortable">
                <v-list-item v-for="(found, index) in foundWords" :key="index" :title="found.word" :subtitle="`temps : ${found.timeSpent}s | ${new Date(found.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}`">
                    <template v-slot:prepend>
                        <v-icon :icon="found.success ? 'mdi-check-circle' : 'mdi-close-circle'"
                            :color="found.success ? 'success' : 'error'"></v-icon>
                    </template>
                </v-list-item>
            </v-list>

            <div class="d-flex justify-end mt-4">
                <v-btn @click="onReset" color="error" variant="tonal" prepend-icon="mdi-delete-outline">
                    Tout effacer
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>