<template>
    <div class="row">
        <div class="col-12 col-md-9">
            <div class="card border-0 mb-5 p-4">
                 <div class="card-title text-center mt-2 fs130 mb-3">
                    Devinez le mot
                </div>
                 <div class="card-body">
                    <!-- input text -->
                    <div class="d-flex justify-content-center mb-5">
                        <div style="max-width: 344px;">
                            <label class="form-label">
                                Votre proposition
                            </label>
                            <input ref="guessInput" v-model="game.userGuess" type="text"
                                class="form-control form-control-lg rounded-0 text-uppercase shadow-primary"
                                placeholder="Saisir un mot" :maxlength="game.wordToGuess.length" :disabled="game.isLoading"
                                @input="game.checkGuessOnInput" @keyup.enter="game.checkGuessOnInput" />
                        </div>
                    </div>

                    <!-- game message -->
                    <transition name="alert-transition">
                        <div v-if="game.message" class="alert mb-2" :class="`alert-${game.typeAlert}`">
                            {{ game.message }}
                        </div>
                    </transition>

                    <div id="container"></div>

                    <!-- hint -->
                    <div class="alert alert-light mb-4">
                        {{ game.hintGuess }}
                    </div>

                    <!-- Actions -->
                    <div class="mb-2">
                        <button class="btn btn-outline-primary me-2" @click="displayNewWord">
                            Passer
                        </button>
                        <button v-if="game.wordFound === false && !game.isLoading && !game.loadingNewGame"
                            class="btn btn-warning me-2" @click="game.revealSolution">
                            Solution
                        </button>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-3">
            <!-- Historique -->
             <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
        </div>


        {{ game.wordToGuess }}
    </div>
</template>

<script setup lang="ts">
import GuessHistory from '@/components/GuessHistory.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useGuessDrawingGameStore } from '@/stores/guessDrawingGame'
import {
  preparePath,
  prepareCircle,
  rectToPath,
  animatePath,
  animateCircle,
  animateOpacity
} from '@/composables/useSvgDrawing'

const game = useGuessDrawingGameStore()
const { initIcons, mdiIcons, initGame } = game
const guessInput = ref<HTMLElement | null>(null)

// Déclenche initSvg quand svgString est mis à jour
watch(() => game.svgString, (newVal) => {
  if (newVal) initSvg()
})

const focusInput = () => {
    guessInput.value?.focus()
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/* =========================================================
   STATE
========================================================= */
let animationId = 0
let elements: Array<SVGPathElement | SVGCircleElement | SVGRectElement | SVGLineElement | SVGPolylineElement | SVGPolygonElement> = [];

onMounted(async () => {
    game.setFocusCallback(focusInput);
    initIcons().then(() => {
        initGame();
    });

    return;
})

function initSvg(){
    const containerEl = document.getElementById("container");
    if (!containerEl || !game.svgString) return

    // Adapter le SVG à la taille du conteneur
    const rect = containerEl.getBoundingClientRect()
    const width: number = Math.floor(rect.width) || 400
    const height: number = Math.floor(rect.height) || 400
    
    let svgText = game.svgString
        .replace(/height="1em"/g, `height="${height}"`)
        .replace(/width="1em"/g, `width="${width}"`)

    containerEl.innerHTML = svgText

    const svg = document.querySelector<SVGSVGElement>("#container svg");

    if (svg) {
        svg.style.visibility = 'hidden';
        elements = [
            ...Array.from(svg.querySelectorAll<SVGPathElement>("path")),
            ...Array.from(svg.querySelectorAll<SVGCircleElement>("circle")),
            ...Array.from(svg.querySelectorAll<SVGRectElement>("rect")),
            ...Array.from(svg.querySelectorAll<SVGLineElement>("line")),
            ...Array.from(svg.querySelectorAll<SVGPolylineElement>("polyline")),
            ...Array.from(svg.querySelectorAll<SVGPolygonElement>("polygon"))
        ];
    }

    drawSVGSequentially();
}

async function drawSVGSequentially(): Promise<void> {
    for (const el of elements) {
        if (el.tagName === "path") {
            preparePath(el as SVGPathElement);
            await animatePath(el as SVGPathElement);
            el.classList.remove("draw-path");
        }

        if (el.tagName === "rect") {
            const path = rectToPath(el as SVGRectElement);
            preparePath(path);
            await animatePath(path);
            path.classList.remove("draw-path");
        }

        if (el.tagName === "circle") {
            prepareCircle(el as SVGCircleElement);
            await animateCircle(el as SVGCircleElement);
        }

        if (el.tagName === "line" || el.tagName === "polyline") {
            preparePath(el as unknown as SVGPathElement);
            await animatePath(el as unknown as SVGPathElement);
            el.classList.remove("draw-path");
        }

        if (el.tagName === "polygon") {
            await animateOpacity(el as SVGPolygonElement);
        }

        await delay(1000);
    }
}


const displayNewWord = () => {
    game.cancelGame()
}

/* =========================================================
   CLEANUP
========================================================= */
onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.container {
    width: 400px;
    height: 400px;
    border: 1px solid red;
    background: white;
}

.container svg {
    width: 400px;
    height: 400px;
    border: 1px solid red;
    background: white;
}

/* Masquer le SVG et tous ses éléments initialement */
#container svg,
#container svg * {
    visibility: hidden;
}

/* styles appliqués pendant le dessin */
.draw-path {
    fill: none !important;
    stroke: #000;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>