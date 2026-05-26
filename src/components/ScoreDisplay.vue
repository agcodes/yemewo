<template>
  <div class="card border-0 mb-4 p-4 bg-highlight">
    <h6 class="fw-medium mb-2">
      <i class="bi bi-star me-2"></i>
      Score
    </h6>

    <div class="text-center p-3">
      <div class="fs-2 bold mb-2">
        {{ game.roundPts }} / {{ game.nbRoundGames }}
      </div>
      <div class="mb-3">
          <span class="fs-5 badge bg-transparent border text-secondary border-info">Temps : {{ game.elapsedTime }}</span>
      </div>
      <div class="bold text-muted mb-3">
        Round {{ game.nbRounds }}
      </div>

      <TransitionGroup name="round" tag="div" class="gap-2 mb-3 d-grid justify-content-center" style="grid-template-columns: repeat(5, 1fr);">
          <span v-for="(round, index) in game.gameRounds" :key="round.index">
            <i v-if="round.level === 1" title="bronze" class="fs180 bi bi-trophy-fill level-bronze"></i>
            <i v-else-if="round.level === 2" title="argent" class="fs180 bi bi-trophy-fill level-silver"></i>
            <i v-else-if="round.level === 3" title="or" class="fs180 bi bi-trophy-fill level-gold"></i>
            <i v-else class="fs180 bi bi-trophy-fill text-muted"></i>
          </span>
        </TransitionGroup>

      <div v-if="game.nbRounds > 1" class="fs-7 text-muted mb-2">
        Total points : {{ game.totalPts }} / {{ game.nbGames }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransitionGroup, watch, ref } from 'vue'
import type { GameRound } from '@/composables/GameRound'

const showNewRoundAlert = ref(false)

interface Game {
  roundPts: number
  nbRoundGames: number
  elapsedTime: string
  nbRounds: number
  totalPts: number,

  nbGames: number,
  gameRounds: GameRound[]
}


const props = defineProps<{
  game: Game
}>()

watch(() => props.game.gameRounds, (newRounds, oldRounds) => {
  if (newRounds.length > oldRounds?.length) {
    showNewRoundAlert.value = true

    console.log("new round");
    setTimeout(() => showNewRoundAlert.value = false, 3000)
  }
}, { deep: true })

</script>
