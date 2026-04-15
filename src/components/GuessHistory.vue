<template>
    <div v-if="historyItems.length > 0" class="card border-0 mb-5 p-5">
        <!-- Titre -->
        <div class="d-flex align-items-center mb-4">
            <i class="bi bi-clock-history me-2"></i>
            <h6 class="mb-0 fw-medium">
                {{ title }}
            </h6>
        </div>

        <!-- Liste historique -->
        <ul class="list-group list-group-flush">
            <li v-for="(item, index) in historyItems" :key="index" class="list-group-item d-flex align-items-start">
                <!-- Icône succès / échec -->
                <i class="me-3 fs-5"
                    :class="item.success ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'"></i>

                <!-- Contenu -->
                <div>
                    <div class="fw-semibold">
                        {{ item.name }}
                    </div>
                    <small class="text-muted">
                        temps : {{ item.timeSpent }}s |
                        {{
                            new Date(item.date).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })
                        }}
                    </small>
                </div>
            </li>
        </ul>

        <!-- Actions -->
        <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-outline-danger" @click="onReset">
                <i class="bi bi-trash me-1"></i>
                Tout effacer
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameItem } from '@/composables/GameItem'

interface Props {
    historyItems: GameItem[]
    onReset: () => void
    title?: string
}

withDefaults(defineProps<Props>(), {
    title: 'Historique'
})
</script>
