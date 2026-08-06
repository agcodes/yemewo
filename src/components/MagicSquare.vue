<template>
  <section class="row">
    <div class="col col-12 col-md-3"">
      <form class="mb-4">
        <ul class="list-group">
          <li class="list-group-item">
            <input role="button" class="btn" type="button" @click="generateNewSquare" value="Nouveau carré" />
          </li>
          <li class="list-group-item">
            <input role="button" class="btn" type="button" @click="showSolution" value="Réponse" />
          </li>
          <li class="list-group-item" v-show="nb === 4">
            <input role="button" class="btn" type="button" @click="switchTo3x3" value="3x3" />
          </li>
          <li class="list-group-item" v-show="nb === 3">
            <input role="button" class="btn" type="button" @click="switchTo4x4" value="4x4" />
          </li>
        </ul>
      </form>

      <aside class="mb-4">
      Dans le carré magique...<br />
      la somme de chaque ligne,<br />
      la somme de chaque colonne,<br />
      et la somme de chaque diagonale<br />
      sont égales.
    </aside>

      <p class="fs140 mbm text-center" id="output-1">Somme : {{ magicSum }}</p>
    </div>

    <div class="col col-12 col-md-9">
      <div :class="['mtm', { 'magic-square-3': nb === 3, 'magic-square-4': nb === 4 }]">
        <div class="square-row">
          <input
            v-for="(val, index) in square"
            :key="index"
            v-model="square[index]"
            :placeholder="hiddenIndices.includes(index) ? '?' : ''"
            min="0"
            max="99"
            type="number"
            :disabled="!hiddenIndices.includes(index)"
            :class="{
              'green': square[index] === mat[index],
              'red': square[index] !== mat[index]
            }"
          />
        </div>
      </div>
    </div>

    
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createFlagCountryStore } from '@/stores/flagCountryGame'

const useFlagStore = createFlagCountryStore('flagHistoryItems_1')
const game = useFlagStore()

const nb = ref<number>(3)
const mat = ref<number[]>([])
const hiddenIndices = ref<number[]>([])
const isRevealed = ref<boolean>(false)

const square = ref<(number | null)[]>(Array(9).fill(null))

const magicSum = computed(() => {
  if (mat.value.length === 0) return ''
  const size = nb.value
  const sum = mat.value.slice(0, size).reduce((a, b) => a + b, 0)
  return sum
})

function generateMagicSquare3() {
  const x = Math.floor(Math.random() * (26 - 5)) + 5
  const a = Math.floor(Math.random() * (17 - 2)) + 2
  const b = Math.floor(Math.random() * (6 - 2)) + 2

  mat.value = [
    x + a,
    x - 2 * b,
    x + 2 * a - b,
    x + 2 * a - 2 * b,
    x + a - b,
    x,
    x - b,
    x + 2 * a,
    x + a - 2 * b
  ]
}

function generateMagicSquare4() {
  const a = Math.floor(Math.random() * 10)
  const b = Math.floor(Math.random() * 10)
  const c = Math.floor(Math.random() * 10)

  mat.value = [
    a + 3 * b + 3 * c,
    a + b,
    a + 2 * b,
    a + 3 * c,
    a + c,
    a + 2 * b + 2 * c,
    a + b + 2 * c,
    a + 3 * b + c,
    a + 2 * c,
    a + 2 * b + c,
    a + b + c,
    a + 3 * b + 2 * c,
    a + 3 * b,
    a + b + 3 * c,
    a + 2 * b + 3 * c,
    a
  ]
}

function generateNewSquare() {
  if (nb.value === 3) {
    generateMagicSquare3()
  } else {
    generateMagicSquare4()
  }

  const size = nb.value === 3 ? 9 : 16
  const numHidden = 5

  hiddenIndices.value = []
  while (hiddenIndices.value.length < numHidden) {
    const idx = Math.floor(Math.random() * size)
    if (!hiddenIndices.value.includes(idx)) {
      hiddenIndices.value.push(idx)
    }
  }

  isRevealed.value = false
  updateDisplay()
}

function showSolution() {
  isRevealed.value = true
  updateDisplay()
}

function switchTo3x3() {
  nb.value = 3
  generateNewSquare()
}

function switchTo4x4() {
  nb.value = 4
  generateNewSquare()
}

function updateDisplay() {
  square.value = [];
  if (nb.value === 3) {
    for (let i = 0; i < 9; i++) {
      if (!hiddenIndices.value.includes(i) || isRevealed.value == true) {
        square.value[i] = mat.value[i] ?? null
      }
      else {
        square.value[i] = 0;
      }
    }
    console.log(square);
  } else {
    for (let i = 0; i < 16; i++) {
      if (!hiddenIndices.value.includes(i) || isRevealed.value == true) {
        square.value[i] = mat.value[i] ?? null
      }
      else {
        square.value[i] = 0;
      }
    }
  }
}

onMounted(() => {
  generateNewSquare()
})
</script>

<style scoped>
.magic-square-3 .square-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width:  80px;
  margin-bottom: 8px;
}

.magic-square-4 .square-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  width:  80px;
  margin-bottom: 8px;
}

input[type="number"] {
  width:  120px;
  height:120px;
  text-align: center;
  font-size: 26px;
}

.green {
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.red {
  background-color: hsl(252, 51%, 86%);
  border-color: #360aae;
}
</style>
