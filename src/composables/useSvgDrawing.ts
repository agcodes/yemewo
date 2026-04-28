export function preparePath(path: SVGPathElement): void {
    path.style.visibility = 'visible';
    const length = path.getTotalLength();
    path.classList.add("draw-path");
    path.style.strokeDasharray = length.toString();
    path.style.strokeDashoffset = length.toString();
}

export function prepareCircle(circle: SVGCircleElement): void {
    circle.style.visibility = 'visible';
    const r = circle.getAttribute("r");
    if (r) circle.dataset.finalRadius = r;
    circle.setAttribute("r", "0");
    circle.style.opacity = "1";
}

export function rectToPath(rect: SVGRectElement): SVGPathElement {
    const x = parseFloat(rect.getAttribute("x") || "0")
    const y = parseFloat(rect.getAttribute("y") || "0")
    const w = parseFloat(rect.getAttribute("width") || "0")
    const h = parseFloat(rect.getAttribute("height") || "0")
    const rx = parseFloat(rect.getAttribute("rx") || "0")
    const ry = parseFloat(rect.getAttribute("ry") || rx.toString())

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

    path.setAttribute("d", d);
    path.setAttribute("fill", rect.getAttribute("fill") || "none");
    path.setAttribute("stroke", rect.getAttribute("stroke") || "#000");
    path.setAttribute("stroke-width", rect.getAttribute("stroke-width") || "2");
    path.style.visibility = 'visible';

    rect.replaceWith(path)
    return path
}

export function animatePath(path: SVGPathElement, duration = 700): Promise<void> {
    return new Promise(resolve => {
        const length = path.getTotalLength();
        let start: number | null = null;

        function frame(time: number) {
            if (start === null) start = time;
            const progress = Math.min((time - start) / duration, 1);
            path.style.strokeDashoffset = (length * (1 - progress)).toString();
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}

export function animateCircle(circle: SVGCircleElement, duration = 300): Promise<void> {
    return new Promise(resolve => {
        const finalR = parseFloat(circle.dataset.finalRadius || "0");
        let start: number | null = null;

        function frame(time: number) {
            if (start === null) start = time;
            const progress = Math.min((time - start) / duration, 1);
            circle.setAttribute("r", (finalR * progress).toString());
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}

export function animateOpacity(el: SVGElement, duration = 300): Promise<void> {
    return new Promise(resolve => {
        el.style.opacity = '0';
        el.style.visibility = 'visible';
        let start: number | null = null;
        function frame(time: number) {
            if (start === null) start = time;
            const progress = Math.min((time - start) / duration, 1);
            el.style.opacity = progress.toString();
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }
        requestAnimationFrame(frame);
    });
}
