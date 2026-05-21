<template>
    <div class="row">
        <div class="col-12 col-md-9">
            <div v-if="game.isLoading" class="card border-0 mb-5 p-3">
                Chargement
            </div>

            <div v-if="!game.isLoading" class="card border-0 mb-5 p-3">
                <div class="card-body">
                    <!-- game message -->
                    <transition name="alert-transition">
                        <div v-if="game.message" class="alert mb-4" :class="`alert-${game.typeAlert}`">
                            {{ game.message }}
                        </div>
                    </transition>
                    <div class="d-flex justify-content-center gap-2 mb-3"
                        :class="{ 'word-found-animation': game.wordFound && game.isGood }">
                        <div v-for="(letter, index) in game.wordToGuess" :key="index"
                            class="d-flex align-items-center text-black justify-content-center shadow-primary word-letter text-uppercase fs-4"
                            :style="{
                                backgroundColor: game.getLetterColor(letter)
                            }">
                            <span>
                                {{
                                    game.wordFound
                                        ? letter.toUpperCase()
                                        : (
                                            ((game.wordToGuess[index] === '-') && !game.userGuess[index])
                                                ? game.getWordToGuessLetter(index)
                                                : (game.userGuess[index] ? game.userGuess[index].toUpperCase() : '')
                                        )
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- input text -->
                    <div class="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <div class="hidden" style="max-width: 300px;">
                            <input ref="guessInput" v-model="game.userGuess" type="text"
                                class="form-control form-control-sm rounded-0 text-uppercase shadow-primary"
                                placeholder="Saisir un mot" :maxlength="game.wordToGuess.length"
                                :disabled="game.isLoading" @input="game.checkGuessOnInput"
                                @keyup.enter="game.checkGuessOnInput" />
                        </div>
                        <button :disabled="game.loadingNewGame" class="btn btn-outline-secondary"
                            @click="game.revealSolution">
                            Passer
                        </button>
                    </div>

                    <!-- drawing -->
                    <div id="container" class="card mb-3"></div>

                    <!-- hint -->
                    <div class="alert alert-light mb-3">
                        {{ game.hintGuess }}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-3">
            <ScoreDisplay :game="game" />
            <!-- Historique -->
            <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique des mots" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ScoreDisplay from '@/components/ScoreDisplay.vue'
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

let previousSvgString: string | null = null

watch(() => game.svgString, (newVal) => {
    if (newVal) initSvg()
})

const focusInput = () => {
    guessInput.value?.focus()
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let animationId = 0
let elements: Array<SVGPathElement | SVGCircleElement | SVGRectElement | SVGLineElement | SVGPolylineElement | SVGPolygonElement> = [];

onMounted(async () => {
    game.initRound();
    game.setFocusCallback(focusInput);
    initIcons().then(() => {
        initGame();
    });
    return;
})

onBeforeUnmount(() => {
    game.clearTimer();
    cancelAnimationFrame(animationId)
})

async function initSvg() {
    const containerEl = document.getElementById("container");
    if (!containerEl || !game.svgString) return

    // Adapter le SVG à la taille du conteneur
    const rect = containerEl.getBoundingClientRect()
    const width: number = Math.floor(rect.width) || 400
    const height: number = 400

    if (previousSvgString) {
        const oldSvg = document.getElementById(previousSvgString)
        if (oldSvg) {
            containerEl.removeChild(oldSvg);
        }
    }

    previousSvgString = `drawing-svg${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`

    const svgDiv = document.createElement('div')
    svgDiv.id = previousSvgString
    svgDiv.style.width = `${width}px`
    svgDiv.style.height = `${height}px`

    let svgText = game.svgString
        .replace(/height="1em"/g, `height="${height}"`)
        .replace(/width="1em"/g, `width="${width}"`)

    svgDiv.innerHTML = svgText
    containerEl.appendChild(svgDiv);
    const svg = document.querySelector<SVGSVGElement>(`#${previousSvgString}`);

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
        await drawSVGSequentially(previousSvgString);

        svgDiv.innerHTML = svgText
        svg.style.visibility = 'visible';
    }
}

async function drawSVGSequentially(svgId: string): Promise<void> {
    for (const el of elements) {
        if (el.tagName === "path") {
            preparePath(el as SVGPathElement);
            await animatePath(el as SVGPathElement, 400);
            //el.classList.remove("draw-path");
        }

        if (el.tagName === "rect") {
            const path = rectToPath(el as SVGRectElement);
            preparePath(path);
            await animatePath(path, 400);
            //path.classList.remove("draw-path");
        }

        if (el.tagName === "circle") {
            prepareCircle(el as SVGCircleElement);
            await animateCircle(el as SVGCircleElement, 400);
        }

        if (el.tagName === "line" || el.tagName === "polyline") {
            preparePath(el as unknown as SVGPathElement);
            await animatePath(el as unknown as SVGPathElement, 400);
            //el.classList.remove("draw-path");
        }

        if (el.tagName === "polygon") {
            await animateOpacity(el as SVGPolygonElement, 400);
        }

        if (svgId !== previousSvgString) {
            // svg has changed during animation, stop drawing
            return;
        }
        await delay(1000);
    }
}

</script>

<style scoped>
/* Masquer le SVG et tous ses éléments initialement */
#container svg,
#container svg * {
    visibility: hidden;
}

.word-found-animation {
    animation: word-found-pulse 0.9s ease;
    transform-origin: center;
}

@keyframes word-found-pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 transparent;
    }

    50% {
        transform: scale(1.03);
        box-shadow: 0 0 0 12px rgba(76, 175, 80, 0.25);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 transparent;
    }
}
</style>