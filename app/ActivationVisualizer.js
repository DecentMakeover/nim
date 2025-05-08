// components/ActivationVisualizer.js
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

// --- Your P5.js Sketch Code (adapted for instance mode) ---
const sketch = (p) => {
    // --- Style Configuration (Apple-esque) ---
    const APPLE_STYLE = {
        background: [240, 240, 240],
        primaryText: [50, 50, 50],
        secondaryText: [100, 100, 100],
        accent: [0, 122, 255],
        graphLine: [0, 122, 255],
        tangentLine: [255, 149, 0], // Apple Orange
        axisLine: [180, 180, 180],
        interactiveMarker: [255, 59, 48], // Apple Red
        interactiveText: [30, 30, 30],
        button: {
            fill: [220, 220, 220],
            stroke: [200, 200, 200],
            text: [50, 50, 50],
            hoverFill: [200, 200, 200],
            activeFill: [0, 122, 255],
            activeText: [255, 255, 255],
            cornerRadius: 8,
            padding: 10,
            spacing: 10,
            height: 35,
            smallHeight: 28,
            smallPadding: 8,
        },
        font: 'Helvetica Neue, Arial, sans-serif',
        titleSize: 24,
        labelSize: 12,
        buttonTextSize: 14,
        smallButtonTextSize: 12,
        infoTextSize: 13,
    };

    // --- Activation Functions & Derivatives ---
    const ACTIVATION_FUNCTIONS = {
        'Sigmoid': x => 1 / (1 + Math.exp(-x)),
        'Tanh': x => Math.tanh(x),
        'ReLU': x => Math.max(0, x),
        'Leaky ReLU': x => x > 0 ? x : 0.01 * x,
        'ELU': x => x > 0 ? x : 1.0 * (Math.exp(x) - 1),
        'Softplus': x => Math.log(1 + Math.exp(x)),
        'Linear': x => x,
    };

    const ACTIVATION_DERIVATIVES = {
        'Sigmoid': x => { const sig = ACTIVATION_FUNCTIONS.Sigmoid(x); return sig * (1 - sig); },
        'Tanh': x => 1 - Math.pow(Math.tanh(x), 2),
        'ReLU': x => x > 0 ? 1 : 0,
        'Leaky ReLU': x => x > 0 ? 1 : 0.01,
        'ELU': x => x > 0 ? 1 : Math.exp(x),
        'Softplus': x => 1 / (1 + Math.exp(-x)),
        'Linear': x => 1,
    };

    let currentFunctionName = 'Sigmoid';
    let buttons = [];
    let resetButton;

    let graphPlotArea = { x: 0, y: 0, w: 0, h: 0 };
    let scaleX, scaleY;

    const xMinDefault = -5, xMaxDefault = 5;
    let xMin = xMinDefault, xMax = xMaxDefault;
    let yMinDefault = -1.5, yMaxDefault = 1.5;
    let yMin = yMinDefault, yMax = yMaxDefault;

    let showInteractiveInfo = false;
    let interactiveMathX = 0;
    let interactiveMathY = 0;
    let interactiveDerivative = 0;

    let isDraggingGraph = false;
    let panStartMouseX, panStartMouseY;
    let panInitialXMin, panInitialYMin;

    let canvasWidth = 800; // Desired canvas width
    let canvasHeight = 550; // Desired canvas height


    // --- Coordinate Mapping ---
    function mapXToScreen(mathX) {
        return graphPlotArea.x + (mathX - xMin) * scaleX;
    }

    function mapYToScreen(mathY) {
        return graphPlotArea.y + (yMax - mathY) * scaleY;
    }

    function mapScreenXToMath(screenX) {
        return xMin + (screenX - graphPlotArea.x) / scaleX;
    }

    function calculateGraphLayoutParameters() {
        const padding = 80;
        const topBarHeight = 80;
        const bottomPadding = 60;

        graphPlotArea.w = canvasWidth - 2 * padding;
        graphPlotArea.h = canvasHeight - topBarHeight - padding - bottomPadding;
        graphPlotArea.x = padding;
        graphPlotArea.y = topBarHeight + padding / 2;

        if (xMax - xMin === 0) scaleX = 1; else scaleX = graphPlotArea.w / (xMax - xMin);
        if (yMax - yMin === 0) scaleY = 1; else scaleY = graphPlotArea.h / (yMax - yMin);
    }

    function updateYRangeAndScale() {
        const func = ACTIVATION_FUNCTIONS[currentFunctionName];
        if (!func) return;
        let newYMin = Infinity, newYMax = -Infinity;

        if (['ReLU', 'Softplus', 'ELU'].includes(currentFunctionName)) {
            newYMin = -0.5;
            for (let tempX = xMin; tempX <= xMax; tempX += (xMax - xMin) / 100) {
                newYMax = Math.max(newYMax, func(tempX));
            }
            newYMax = Math.max(newYMax + 0.5, 4.5);
        } else if (currentFunctionName === 'Linear') {
            newYMin = Math.min(func(xMin), func(xMax));
            newYMax = Math.max(func(xMin), func(xMax));
            if (newYMax - newYMin < 1) {
                let mid = (newYMax + newYMin) / 2;
                newYMin = mid - 0.5; newYMax = mid + 0.5;
            }
            let padding = (newYMax - newYMin) * 0.1;
            newYMin -= padding; newYMax += padding;
        } else {
            newYMin = yMinDefault; newYMax = yMaxDefault;
        }
        yMin = newYMin; yMax = newYMax;
        if (yMax - yMin === 0) scaleY = 1; else scaleY = graphPlotArea.h / (yMax - yMin);
    }

    function resetView() {
        xMin = xMinDefault; xMax = xMaxDefault;
        calculateGraphLayoutParameters();
        updateYRangeAndScale();
    }

    function createButtons() {
        buttons = [];
        let btnX = APPLE_STYLE.button.padding;
        const btnY = 25 + APPLE_STYLE.button.padding;
        const funcNames = Object.keys(ACTIVATION_FUNCTIONS);

        for (let i = 0; i < funcNames.length; i++) {
            const name = funcNames[i];
            p.textSize(APPLE_STYLE.buttonTextSize);
            let btnW = p.textWidth(name) + APPLE_STYLE.button.padding * 2;
            btnW = p.max(btnW, 80);
            buttons.push({
                x: btnX, y: btnY, w: btnW, h: APPLE_STYLE.button.height, label: name,
                action: () => { currentFunctionName = name; resetView(); }
            });
            btnX += btnW + APPLE_STYLE.button.spacing;
        }
        p.textSize(APPLE_STYLE.smallButtonTextSize);
        let resetBtnW = p.textWidth("Reset View") + APPLE_STYLE.button.smallPadding * 2;
        resetButton = {
            x: graphPlotArea.x + graphPlotArea.w - resetBtnW,
            y: graphPlotArea.y + graphPlotArea.h + APPLE_STYLE.button.spacing + 5,
            w: resetBtnW, h: APPLE_STYLE.button.smallHeight, label: "Reset View", action: resetView
        };
    }

    // p.setup is called once when the program starts.
    p.setup = () => {
        let renderer = p.createCanvas(canvasWidth, canvasHeight);
        // renderer.parent(sketchRef.current); // sketchRef is not defined here
        // This will be handled by the React component passing the parent
        p.textFont(APPLE_STYLE.font);
        p.textAlign(p.CENTER, p.CENTER);
        calculateGraphLayoutParameters();
        updateYRangeAndScale();
        createButtons();
    };

    // p.draw is called continuously
    p.draw = () => {
        p.background(APPLE_STYLE.background);
        handleInteractivity();
        drawTitle();
        drawButtons();
        drawResetButton();
        drawAxes();
        drawGraph();
        drawFunctionName();
        drawInteractiveElements();
    };

    function handleInteractivity() {
        if (p.mouseX > graphPlotArea.x && p.mouseX < graphPlotArea.x + graphPlotArea.w &&
            p.mouseY > graphPlotArea.y && p.mouseY < graphPlotArea.y + graphPlotArea.h) {
            showInteractiveInfo = true;
            interactiveMathX = mapScreenXToMath(p.mouseX);
            const func = ACTIVATION_FUNCTIONS[currentFunctionName];
            const derivFunc = ACTIVATION_DERIVATIVES[currentFunctionName];
            if (func && derivFunc) {
                interactiveMathY = func(interactiveMathX);
                interactiveDerivative = derivFunc(interactiveMathX);
            }
        } else {
            showInteractiveInfo = false;
        }
    }

    function drawInteractiveElements() {
         if (!showInteractiveInfo || isNaN(scaleX) || isNaN(scaleY) || scaleX === 0 || scaleY === 0) return;
         let screenMarkerX = mapXToScreen(interactiveMathX);
         let screenMarkerY = mapYToScreen(interactiveMathY);
         screenMarkerX = p.constrain(screenMarkerX, graphPlotArea.x, graphPlotArea.x + graphPlotArea.w);
         screenMarkerY = p.constrain(screenMarkerY, graphPlotArea.y, graphPlotArea.y + graphPlotArea.h);

         p.push();
         p.stroke(APPLE_STYLE.tangentLine);
         p.strokeWeight(1.5);
         const tangentSpan = (xMax - xMin) / 10;
         const x1_tan = interactiveMathX - tangentSpan;
         const y1_tan = interactiveMathY + interactiveDerivative * (x1_tan - interactiveMathX);
         const x2_tan = interactiveMathX + tangentSpan;
         const y2_tan = interactiveMathY + interactiveDerivative * (x2_tan - interactiveMathX);
         p.line(mapXToScreen(x1_tan), mapYToScreen(y1_tan), mapXToScreen(x2_tan), mapYToScreen(y2_tan));
         p.pop();

         p.push();
         p.fill(APPLE_STYLE.interactiveMarker);
         p.noStroke();
         p.ellipse(screenMarkerX, screenMarkerY, 8, 8);
         p.pop();

         p.push();
         const textContent = `x: ${interactiveMathX.toFixed(2)}\ny: ${interactiveMathY.toFixed(2)}\ndy/dx: ${interactiveDerivative.toFixed(3)}`;
         p.textSize(APPLE_STYLE.infoTextSize);
         const textPadding = 8;
         const lines = textContent.split('\n');
         let maxTextWidth = 0;
         lines.forEach(line => maxTextWidth = Math.max(maxTextWidth, p.textWidth(line)));
         const textWidthVal = maxTextWidth + textPadding * 2;
         const textHeightVal = (APPLE_STYLE.infoTextSize + 3) * lines.length + textPadding * 2 - 3;
         let finalTextBoxX = p.mouseX + 15;
         let finalTextBoxY = p.mouseY - 15 - textHeightVal;
         if (finalTextBoxX + textWidthVal > canvasWidth - 10) finalTextBoxX = p.mouseX - 15 - textWidthVal;
         if (finalTextBoxY < 10) finalTextBoxY = p.mouseY + 15;
         if (finalTextBoxX < 10) finalTextBoxX = 10;
         p.fill(255, 255, 255, 220);
         p.stroke(APPLE_STYLE.axisLine);
         p.strokeWeight(1);
         p.rect(finalTextBoxX, finalTextBoxY, textWidthVal, textHeightVal, 5);
         p.fill(APPLE_STYLE.interactiveText);
         p.noStroke();
         p.textAlign(p.LEFT, p.TOP);
         p.text(textContent, finalTextBoxX + textPadding, finalTextBoxY + textPadding);
         p.pop();
    }

    function drawTitle() {
        p.fill(APPLE_STYLE.primaryText);
        p.textSize(APPLE_STYLE.titleSize);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Activation Function Visualizer", canvasWidth / 2, APPLE_STYLE.button.padding);
    }

    function drawFunctionName() {
        p.fill(APPLE_STYLE.accent);
        p.textSize(APPLE_STYLE.labelSize + 4);
        p.textAlign(p.CENTER, p.TOP);
        p.text(currentFunctionName, graphPlotArea.x + graphPlotArea.w / 2, graphPlotArea.y + graphPlotArea.h + APPLE_STYLE.button.spacing + 2);
    }

    function drawButton(btn, isSmall = false) {
         p.push();
         const isActive = btn.label === currentFunctionName && btn.label !== "Reset View";
         const isHover = p.mouseX > btn.x && p.mouseX < btn.x + btn.w &&
                         p.mouseY > btn.y && p.mouseY < btn.y + btn.h;
         if (isActive) {
             p.fill(APPLE_STYLE.button.activeFill);
             p.stroke(APPLE_STYLE.button.activeFill);
         } else if (isHover) {
             p.fill(APPLE_STYLE.button.hoverFill);
             p.stroke(APPLE_STYLE.button.stroke);
         } else {
             p.fill(APPLE_STYLE.button.fill);
             p.stroke(APPLE_STYLE.button.stroke);
         }
         p.strokeWeight(1);
         p.rect(btn.x, btn.y, btn.w, btn.h, APPLE_STYLE.button.cornerRadius);
         p.noStroke();
         p.fill(isActive ? APPLE_STYLE.button.activeText : APPLE_STYLE.button.text);
         p.textSize(isSmall ? APPLE_STYLE.smallButtonTextSize : APPLE_STYLE.buttonTextSize);
         p.textAlign(p.CENTER, p.CENTER);
         p.text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
         p.pop();
    }
    function drawButtons() { buttons.forEach(btn => drawButton(btn)); }
    function drawResetButton() { drawButton(resetButton, true); }

    function drawAxes() {
        if (isNaN(scaleX) || isNaN(scaleY) || scaleX <= 0 || scaleY <= 0) return;
        p.push();
        p.stroke(APPLE_STYLE.axisLine);
        p.strokeWeight(1.5);
        let xAxisScreenY = mapYToScreen(0);
        if (xAxisScreenY >= graphPlotArea.y && xAxisScreenY <= graphPlotArea.y + graphPlotArea.h) {
            p.line(graphPlotArea.x, xAxisScreenY, graphPlotArea.x + graphPlotArea.w, xAxisScreenY);
        }
        let yAxisScreenX = mapXToScreen(0);
        if (yAxisScreenX >= graphPlotArea.x && yAxisScreenX <= graphPlotArea.x + graphPlotArea.w) {
            p.line(yAxisScreenX, graphPlotArea.y, yAxisScreenX, graphPlotArea.y + graphPlotArea.h);
        }
        p.textSize(APPLE_STYLE.labelSize - 2);
        p.fill(APPLE_STYLE.secondaryText);
        p.noStroke();
        p.textAlign(p.CENTER, p.TOP);
        const xRange = xMax - xMin;
        let xTickStep = 1;
        if (xRange > 20) xTickStep = 5; else if (xRange > 10) xTickStep = 2; else if (xRange < 2) xTickStep = 0.5; else if (xRange < 0.5) xTickStep = 0.1;
        for (let xVal = Math.ceil(xMin / xTickStep) * xTickStep; xVal <= xMax; xVal += xTickStep) {
            let screenX = mapXToScreen(xVal);
            if (screenX < graphPlotArea.x - 1 || screenX > graphPlotArea.x + graphPlotArea.w + 1) continue;
            let yPos = (xAxisScreenY >= graphPlotArea.y && xAxisScreenY <= graphPlotArea.y + graphPlotArea.h) ? xAxisScreenY : graphPlotArea.y + graphPlotArea.h;
            if (Math.abs(xVal) > 1e-9 || mapXToScreen(0) < graphPlotArea.x || mapXToScreen(0) > graphPlotArea.x + graphPlotArea.w ) {
                 p.text(xVal.toFixed(xTickStep < 1 ? 1 : 0), screenX, yPos + 5);
            }
            p.stroke(APPLE_STYLE.axisLine);
            p.line(screenX, yPos - 3, screenX, yPos + 3);
            p.noStroke();
        }
        p.textAlign(p.RIGHT, p.CENTER);
        const yRange = yMax - yMin;
        let yTickStep = 1;
        if (yRange > 20) yTickStep = 5; else if (yRange > 10) yTickStep = 2; else if (yRange < 2) yTickStep = 0.5; else if (yRange < 0.5) yTickStep = 0.1;
        for (let yVal = Math.ceil(yMin / yTickStep) * yTickStep; yVal <= yMax; yVal += yTickStep) {
            let screenY = mapYToScreen(yVal);
            if (screenY < graphPlotArea.y - 1 || screenY > graphPlotArea.y + graphPlotArea.h + 1) continue;
            let xPos = (yAxisScreenX >= graphPlotArea.x && yAxisScreenX <= graphPlotArea.x + graphPlotArea.w) ? yAxisScreenX : graphPlotArea.x;
             if (Math.abs(yVal) > 1e-9 || mapYToScreen(0) < graphPlotArea.y || mapYToScreen(0) > graphPlotArea.y + graphPlotArea.h) {
                p.text(yVal.toFixed(yTickStep < 1 ? 1 : 0), xPos - 5, screenY);
            }
            p.stroke(APPLE_STYLE.axisLine);
            p.line(xPos - 3, screenY, xPos + 3, screenY);
            p.noStroke();
        }
        p.textSize(APPLE_STYLE.labelSize);
        p.fill(APPLE_STYLE.primaryText);
        p.textAlign(p.CENTER, p.TOP);
        p.text("x", graphPlotArea.x + graphPlotArea.w - 10, p.constrain(mapYToScreen(0), graphPlotArea.y, graphPlotArea.y + graphPlotArea.h - 20) + 15);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text("y", p.constrain(mapXToScreen(0), graphPlotArea.x + 20, graphPlotArea.x + graphPlotArea.w) -15 , graphPlotArea.y + 10);
        p.pop();
    }

    function drawGraph() {
        const func = ACTIVATION_FUNCTIONS[currentFunctionName];
        if (!func || isNaN(scaleX) || isNaN(scaleY) || scaleX <= 0 || scaleY <= 0) return;
        p.push();
        p.noFill();
        p.stroke(APPLE_STYLE.graphLine);
        p.strokeWeight(2.5);
        p.beginShape();
        for (let sx = 0; sx <= graphPlotArea.w; sx++) {
            let mathX = xMin + sx / scaleX;
            let mathY = func(mathX);
            let sy = mapYToScreen(mathY);
            sy = p.constrain(sy, graphPlotArea.y, graphPlotArea.y + graphPlotArea.h);
            p.vertex(graphPlotArea.x + sx, sy);
        }
        p.endShape();
        p.pop();
    }

    // Event handlers
    p.mousePressed = () => {
        for (let btn of buttons) {
            if (p.mouseX > btn.x && p.mouseX < btn.x + btn.w && p.mouseY > btn.y && p.mouseY < btn.y + btn.h) {
                btn.action(); return;
            }
        }
        if (p.mouseX > resetButton.x && p.mouseX < resetButton.x + resetButton.w && p.mouseY > resetButton.y && p.mouseY < resetButton.y + resetButton.h) {
            resetButton.action(); return;
        }
        if (p.mouseX > graphPlotArea.x && p.mouseX < graphPlotArea.x + graphPlotArea.w &&
            p.mouseY > graphPlotArea.y && p.mouseY < graphPlotArea.y + graphPlotArea.h) {
            isDraggingGraph = true;
            panStartMouseX = p.mouseX; panStartMouseY = p.mouseY;
            panInitialXMin = xMin; panInitialYMin = yMin;
        }
    };

    p.mouseDragged = () => {
        if (isDraggingGraph) {
            if (scaleX <=0 || scaleY <=0) { isDraggingGraph = false; return; }
            let dxScreen = p.mouseX - panStartMouseX;
            let dyScreen = p.mouseY - panStartMouseY;
            let dxMath = dxScreen / scaleX;
            let dyMath = dyScreen / scaleY;
            xMin = panInitialXMin - dxMath;
            xMax = xMin + graphPlotArea.w / scaleX;
            yMin = panInitialYMin + dyMath;
            yMax = yMin + graphPlotArea.h / scaleY;
        }
    };

    p.mouseReleased = () => {
        isDraggingGraph = false;
    };

    // p.windowResized is not directly applicable here as canvas size is fixed.
    // If you want responsive canvas, you'd need more complex logic to update
    // canvasWidth/Height and call p.resizeCanvas(), then recalculate layout.
    // For simplicity, we'll keep it fixed.
};

// --- React Component ---
const ActivationVisualizer = () => {
    const sketchRef = useRef(null); // To hold the div where canvas will be attached
    const p5InstanceRef = useRef(null); // To hold the p5 instance

    useEffect(() => {
        // This check ensures P5.js only runs on the client side
        if (typeof window !== 'undefined') {
            // Create a new P5 instance and attach it to the sketchRef div
            p5InstanceRef.current = new p5(sketch, sketchRef.current);
        }

        // Cleanup function: remove the P5 instance when the component unmounts
        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
                p5InstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    return <div ref={sketchRef} />;
    // You might want to add some styling to this div, e.g., to center it or give it dimensions
    // if the P5 canvas doesn't take up all its parent's space.
};

export default ActivationVisualizer;