<template>
    <div class="row">
        <div class="col-12 col-md-9">
            <div v-if="game.loadingError" class="alert mb-5" :class="`alert-${game.typeAlert}`">
                <p class="mb-4">{{ game.message }}</p>
                <button class="btn btn-outline-secondary" @click="initRound">
                    Recharger
                </button>
            </div>

            <div v-if="game.isLoading" class="card border-0 mb-5 p-3">
                Chargement
            </div>

            <div v-if="game.savedCountry" class="card border-0 mb-5 p-3">
                <div class="card-body">
                    <transition name="alert-transition" mode="out-in">
                        <div class="mb-4" :key="alertKey">
                            <div v-if="game.gameEnd === true" class="card rounded-0 mb-5 p-4">
                                <div class="alert alert-info mb-4">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Fin du jeu ! Votre score est {{ game.roundPts }} / {{ game.nbRoundGames }}
                                </div>

                                <button class="btn btn-outline-primary" @click="initRound">
                                    Nouveau jeu
                                </button>
                            </div>

                            <div v-if="game.previousCountry && game.message" :class="`alert-${game.typeAlert}`"
                                class="alert">
                                <i v-if="game.typeAlert == 'danger'" class="bi bi-x-circle me-2"></i>
                                <i v-if="game.typeAlert == 'success'" class="bi bi-check-circle me-2"></i>
                                {{ game.message }}
                            </div>

                            <div v-else-if="!game.isLoading" class="alert alert-info">
                                {{ game.message }}
                            </div>
                        </div>
                    </transition>

                    <!-- drawing -->
                    <div id="container" class="card mb-3"></div>

                    <!-- countries choice -->
                    <div class="row">
                        <div v-for="(choice, index) in choices" :key="index" class="col-12 col-sm-6 mb-4">
                            <div :class="{
                                good: game.isSubmitted && game.isGood && choice.value === game.savedCountry.flagSvg,
                                bad: game.isSubmitted && !game.isGood && choice.value === game.savedCountry.flagSvg,
                                selected: game.isSubmitted && choice.value === selected
                            }" class="card p-3 bg-highlight flag-border" role="button"
                                @click="clickFlag(choice.value)">
                                {{ choice.label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-md-3">
            <ScoreDisplay :game="game" />

            <!-- History -->
            <GuessHistory :historyItems="game.historyItems" :onReset="game.resetHistory" title="Historique" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useFlagCountryStore } from '@/stores/flagCountryGame'
import { API_CONFIG } from '@/config/apiConfig'
const game = useFlagCountryStore()

import GuessHistory from '@/components/GuessHistory.vue'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import {
    extractSvgElements,
    drawSvgElement
} from '@/composables/useSvgDrawing'

let previousSvgId: string | null = null

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const choices = ref<{ label: string; value: string }[]>([])
const selected = ref<string>('')

let autoNextTimer = ref<ReturnType<typeof setTimeout> | null>(null)

onMounted(() => {
    game.init()
    game.startTimer()
    initRound();
})

onBeforeUnmount(() => {
    game.clearTimer()
})

const alertKey = ref(0);
watch(
    () => [game.isGood, game.previousCountry],
    () => {
        alertKey.value++;
    },
    { deep: true }
);

function initRound() {
    game.initRound()
    game.clearTimer()
    loadQuiz(true)
}

async function loadQuiz(reload: boolean) {
    try {
        choices.value = await game.defineNewGame(4, reload);
        if (choices.value.length > 0) {
            game.isLoading = false
            initSvg()
            game.startTimer();
        }
    } catch (error) {
        game.isLoading = false
    }
}

function clickFlag(choice: string) {
    selected.value = choice;
    submit();
}

function submit() {
    if (game.isSubmitted) return
    game.submit(selected.value)

    if (game.gameEnd) {
        return
    }

    autoNextTimer.value = setTimeout(() => {
        newQuiz()
    }, 3000)
}

function newQuiz() {
    choices.value = []
    selected.value = ''
    loadQuiz(false)
}


async function initSvg() {
    let svgString = "";

    //https://flags.restcountries.com/v5/svg/ad.svg


    if (game.savedCountry && game.savedCountry.flagSvg) {
        let flagSvg = "https://flags.restcountries.com/v5/svg/ad.svg";
        const flagUrl = flagSvg.startsWith(API_CONFIG.REST_COUNTRIES_FLAGS_BASE_URL)
            ? `${API_CONFIG.REST_COUNTRIES_FLAGS_PROXY_PATH}${flagSvg.substring(API_CONFIG.REST_COUNTRIES_FLAGS_BASE_URL.length)}`
            : flagSvg

        console.log(flagSvg);
        const response = await fetch(flagUrl)
        if (!response.ok) {
            throw new Error(`Unable to load SVG: ${response.status} ${response.statusText}`)
        }
        svgString = await response.text()
    }

    const containerEl = document.getElementById("container");
    if (!containerEl || !svgString) return

    // Adapter le SVG à la taille du conteneur
    const rect = containerEl.getBoundingClientRect()
    const width: number = Math.floor(rect.width) || 400
    const height: number = 400

    if (previousSvgId) {
        const oldSvg = document.getElementById(previousSvgId)
        if (oldSvg) {
            containerEl.removeChild(oldSvg);
        }
    }

    previousSvgId = `drawing-svg${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`

    const svgDiv = document.createElement('div')
    svgDiv.id = previousSvgId
    svgDiv.style.width = `${width}px`
    svgDiv.style.height = `${height}px`
    svgDiv.style.overflow = 'hidden'
    svgDiv.style.display = 'flex'
    svgDiv.style.justifyContent = 'center'
    svgDiv.style.alignItems = 'center'

    let svgText = svgString.replace(/<svg([^>]*?)>/i, (match, attrs) => {
        let newAttrs = attrs
        if (!/viewBox=/i.test(attrs)) {
            const widthMatch = attrs.match(/width="([^"]+)"/i)
            const heightMatch = attrs.match(/height="([^"]+)"/i)

            const widthValue = widthMatch ? parseFloat(widthMatch[1]) : NaN
            const heightValue = heightMatch ? parseFloat(heightMatch[1]) : NaN
            if (!Number.isNaN(widthValue) && !Number.isNaN(heightValue)) {
                newAttrs += ` viewBox="0 0 ${widthValue} ${heightValue}"`
            }
        }
        if (!/preserveAspectRatio=/i.test(newAttrs)) {
            newAttrs += ' preserveAspectRatio="xMidYMid meet"'
        }
        return `<svg${newAttrs}>`
    })
    svgText = svgText
        .replace(/width="[^"]*"/g, 'width="100%"')
        .replace(/height="[^"]*"/g, 'height="100%"')

    svgDiv.innerHTML = svgText
    containerEl.appendChild(svgDiv);
    const svg = document.querySelector<SVGSVGElement>(`#${previousSvgId}`);

    if (svg) {
        svg.style.visibility = 'hidden';
        await drawSVGSequentially(previousSvgId, extractSvgElements(svg));

        svgDiv.innerHTML = svgText
        svg.style.visibility = 'visible';
    }
}

async function drawSVGSequentially(svgId: string, elements: Array<SVGPathElement | SVGCircleElement | SVGRectElement | SVGLineElement | SVGPolylineElement | SVGPolygonElement | SVGGElement>): Promise<void> {
    for (const el of elements) {
        await drawSvgElement(el);
        await delay(1000);

        if (svgId !== previousSvgId) {
            // svg has changed during animation, stop drawing
            return;
        }
    }
}

</script>

<style scoped>
#container,
#container>div {
    overflow: hidden;
}

#container svg {
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
}
</style>