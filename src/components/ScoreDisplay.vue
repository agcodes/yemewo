<template>
  <div class="card border-0 mb-4 p-4 bg-highlight">
    <h6 class="fw-medium mb-2">
      <i class="bi bi-star me-2"></i>
      Score
    </h6>

    <div class="text-center p-3">
      <div class="fs-2 fw-black mb-2">
        {{ game.roundPts }} / {{ game.nbRoundGames }}
      </div>
      <div class="text-muted mb-2">
        Temps : {{ game.elapsedTime }}
      </div>
      <div class="text-muted mb-4">
        Round {{ game.nbRounds }}
      </div>

      <TransitionGroup name="round" tag="div" class="gap-2 d-flex justify-content-center">
        <span v-for="(round, index) in game.gameRounds" :key="round.index">
          <i v-if="round.level === 1" title="bronze" class="fs180 bi bi-trophy-fill level-bronze"></i>
          <i v-else-if="round.level === 2" title="argent" class="fs180 bi bi-trophy-fill level-silver"></i>
          <i v-else-if="round.level === 3" title="or" class="fs180 bi bi-trophy-fill level-gold"></i>
          <i v-else class="fs180 bi bi-trophy-fill text-muted"></i>
        </span>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransitionGroup } from 'vue'
import type { GameRound } from '@/composables/GameRound'

interface Game {
  roundPts: number
  nbRoundGames: number
  elapsedTime: string
  nbRounds: number
  gameRounds: GameRound[]
}

defineProps<{
  game: Game
}>()
</script>
