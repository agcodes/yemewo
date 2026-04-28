<template>
    <div class="row">
        <div class="col-12 col-md-9">
            <div class="card border-0 mb-5 p-4">
                <div id="container"></div>
            </div>
        </div>
        <div class="col-12 col-md-3">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useGuessDrawingGameStore } from '@/stores/guessDrawingGame'


const game = useGuessDrawingGameStore()

/* =========================================================
   SVG SOURCE
========================================================= */

const getRandomKeyword = () => {
    return mdiIcons[Math.floor(Math.random() * mdiIcons.length)]
}

const buildSvgUrl = (keyword: string) => `https://api.iconify.design/${iconType}:${keyword}.svg`

let animationId = 0
let mdiIcons: string[] | null = null;
const iconType = "openmoji";
let elements = [
];

/* =========================================================
   LOAD SVG FROM URL
========================================================= */
const loadSvg = async (): Promise<string> => {
    const keyword = 'accordion'// 'accordion';// getRandomKeyword()
    console.log(`Loading SVG for keyword: ${keyword}`)
    const svgUrl = buildSvgUrl(keyword)
    const response = await fetch(svgUrl)
    if (!response.ok) {
        throw new Error(`Unable to load SVG: ${response.status} ${response.statusText}`)
    }
    return response.text()
}

function preparePath(path) {
    const length = path.getTotalLength();
    path.classList.add("draw-path");
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
}

function prepareCircle(circle) {
    const r = circle.getAttribute("r");
    circle.dataset.finalRadius = r;
    circle.setAttribute("r", "0");
    circle.style.opacity = "1";
}


function rectToPath(rect) {
    const x = parseFloat(rect.getAttribute("x") || 0)
    const y = parseFloat(rect.getAttribute("y") || 0)
    const w = parseFloat(rect.getAttribute("width"))
    const h = parseFloat(rect.getAttribute("height"))
    const rx = parseFloat(rect.getAttribute("rx") || 0)
    const ry = parseFloat(rect.getAttribute("ry") || rx)

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

    const d = `
        M${x + rx},${y}
        H${x + w - rx}
        Q${x + w},${y} ${x + w},${y + ry}
        V${y + h - ry}
        Q${x + w},${y + h} ${x + w - rx},${y + h}
        H${x + rx}
        Q${x},${y + h} ${x},${y + h - ry}
        V${y + ry}
        Q${x},${y} ${x + rx},${y}
        Z
    `

    path.setAttribute("d", d)
    path.setAttribute("fill", rect.getAttribute("fill") || "none")
    path.setAttribute("stroke", rect.getAttribute("stroke") || "#000")
    path.setAttribute("stroke-width", rect.getAttribute("stroke-width") || "2")

    rect.replaceWith(path)
    return path
}


function animatePath(path, duration = 700) {
    return new Promise(resolve => {
        const length = path.getTotalLength();
        let start = null;

        function frame(time) {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            path.style.strokeDashoffset = length * (1 - progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}

function animateCircle(circle, duration = 300) {
    return new Promise(resolve => {
        const finalR = parseFloat(circle.dataset.finalRadius);
        let start = null;

        function frame(time) {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            circle.setAttribute("r", finalR * progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}
async function drawSVGSequentially() {
    for (const el of elements) {
        if (el.tagName === "path") {
            preparePath(el);
            await animatePath(el);
            el.classList.remove("draw-path"); // restore fill
        }

        if (el.tagName === "rect") {
            const path = rectToPath(el)
            preparePath(path);
            await animatePath(path);
        }

        if (el.tagName === "circle") {
            prepareCircle(el);
            await animateCircle(el);
        }
    }

    console.log("✅ SVG dessiné entièrement");
}

/* =========================================================
   MOUNT
========================================================= */
onMounted(async () => {
    /*
    const res = await fetch(
        `https://api.iconify.design/collection?prefix=${iconType}`
    )
    const data = await res.json()
*/
    const data: any = [];
    if (data) {

        const iconNames = new Set<string>()

        const allowedCategories = [
            'Sport',
            'Objects',
            'Education',
            'Automotive',
            'Hardware / Tools',
            'Fruits & Vegetables',
            'Animal',
            'Clothing',
            'Nature',
            'Food / Drink',
            'Music'
        ];

        // uniquement les catégories voulues
        for (const category of allowedCategories) {
            if (data.categories?.[category]) {
                const icons = data.categories?.[category]
                if (Array.isArray(icons)) {
                    icons.forEach((name: string) => {
                        iconNames.add(name)
                    })
                }
            }
        }

        // icônes finales
        mdiIcons = Array.from(iconNames).map(
            name => `${name}`
        )
        mdiIcons = mdiIcons.filter(a => !a.includes('-'))
    }

    let svgText = await loadSvg()

    svgText = svgText.replace('height="1em"', 'height="400"').replace('width="1em"', 'width="400"')

    if (!svgText) return
    document.getElementById("container").innerHTML = svgText

    const svg = document.querySelector("svg");

    elements = [
        ...svg.querySelectorAll("path"),
        ...svg.querySelectorAll("circle"),
        ...svg.querySelectorAll("rect"),
        ...svg.querySelectorAll("line"),
        ...svg.querySelectorAll("polyline"),
        ...svg.querySelectorAll("polygon")
    ];

    drawSVGSequentially();
})

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

/* styles appliqués pendant le dessin */
.draw-path {
    fill: none !important;
    stroke: #000;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>