// Values modified by user input
let baseHue = 0;
const baseHueSpeedMult = 0.01;

let hueMod = 0;
const hueModSpeedMult = 0.0025;
const hueModIntensity = 5;

let baseOffsetX = 0;
const baseXSpeedMult = 0.001;

let baseOffsetY = 0;
const baseYSpeedMult = 0.001;

let controlOffset1 = 0;
const control1SpeedMult = 0.001;
const control1Intensity = 100;

let controlOffset2 = 0;
const control2SpeedMult = 0.001;
const control2Intensity = 100;

const skewIntensity = 800;
const interactIntensity = 100;
const interactHueIntensity = 0.05;

const horizLines = 6;
const vertLines = 6;

const canvasWidth = 800;
const canvasHeight = 800;

export function setupMesh(parent) {
    new p5(sketch, parent);
}
function sketch(p) {
    p.setup = function () {
        p.createCanvas(canvasWidth, canvasHeight);
        p.colorMode(p.HSB, 100);
    }
    p.draw = function () {
        p.background(88.24);
        // Update input values
        updateValues()

        const allBeziers = getMeshVertices(p);
        displayMesh(p, allBeziers)

        // update input values based on click location
        if (p.mouseIsPressed) {
            const xDiff = (p.mouseX / p.width) - 0.5;
            const yDiff = (p.mouseY / p.height) - 0.5;
            const val1 = Math.max(xDiff, 0)
            const val2 = Math.max(yDiff, 0)
            const val3 = Math.max(-xDiff, 0)
            const val4 = Math.max(-yDiff, 0)

            baseHue += baseHueSpeedMult * val1 * interactHueIntensity;
            hueMod += hueModIntensity * val2 * interactHueIntensity;
            baseOffsetX += baseXSpeedMult * val3 * interactIntensity;
            baseOffsetY += baseYSpeedMult * val4 * interactIntensity;
        }
    };
}
function updateValues() {
    // Values should be controlled in weird ways
    baseHue += 3 * baseHueSpeedMult;
    hueMod += 5 * hueModSpeedMult;
    baseOffsetX += 7 * baseXSpeedMult;
    controlOffset1 += 9 * control1SpeedMult;
    baseOffsetY += 11 * baseYSpeedMult;
    controlOffset2 += 13 * control2SpeedMult;

    baseHue = baseHue % 100;
    hueMod = hueMod % (Math.PI * 2);
    baseOffsetX = baseOffsetX % (Math.PI * 2);;
    baseOffsetY = baseOffsetY % (Math.PI * 2);;
    controlOffset1 = controlOffset1 % (Math.PI * 2);
    controlOffset2 = controlOffset2 % (Math.PI * 2);
}
function getMeshVertices(p) {
    // Each element within this should have two points (for the start and end of the bezier)
    const horizBeziers = []
    // Create horizontal beziers
    const offset1 = Math.sin(controlOffset1) * control1Intensity;
    const offset2 = Math.sin(controlOffset2) * control2Intensity;
    const xBaseSkew = Math.sin(baseOffsetX);
    const yBaseSkew = Math.sin(baseOffsetY);

    for (let i = 0; i < horizLines; i++) {
        const bezier = {};

        const yPct = ((i + 1) / (horizLines + 1));
        const y = ((1 - skewFormula(yBaseSkew, yPct)) * skewIntensity) + (p.width * 0.5);
        // Determines where the control points for the bezier will be
        const vertOffset = offset1;
        const horizOffset = offset2;

        bezier.pointA = [0, y];
        bezier.pointB = [canvasWidth, y];
        bezier.controlA = [0 + horizOffset, y + vertOffset];
        bezier.controlB = [canvasWidth - horizOffset, y - vertOffset];

        horizBeziers.push(bezier);
    }
    const vertBeziers = []
    // Same as above but for the beziers that go vertically
    for (let i = 0; i < vertLines; i++) {
        const bezier = {};

        // could make this be on a curve or something so that the points can be scrunched towards one end (doesn't have to stay at the exact same total height difference)
        const xPct = ((i + 1) / (vertLines + 1));
        const x = ((1 - skewFormula(xBaseSkew, xPct)) * skewIntensity) + (p.height * 0.5);


        // Determines where the control points for the bezier will be
        const vertOffset = offset2;
        const horizOffset = -offset1;

        bezier.pointA = [x, 0];
        bezier.pointB = [x, canvasHeight];
        bezier.controlA = [x + horizOffset, 0 + vertOffset];
        bezier.controlB = [x - horizOffset, canvasHeight - vertOffset];

        vertBeziers.push(bezier);
    }

    return [horizBeziers, vertBeziers];
}

function skewFormula(curveSkew, curvePoint) {
    // bunch of constants and stuff that plug into this formula to make it work
    // https://www.desmos.com/calculator/sjrhokjdrg
    const height = 0.75;
    const yCenter = 1.075;
    const xCenter = 0.5;
    return -(height * ((curvePoint - xCenter) ** 2)) + (curveSkew * (curvePoint - xCenter)) + yCenter;
}
function displayMesh(p, allBeziers) {
    // Similar code to what I used for the radial waveforms, except this time it's always exactly four control points per bezier (no longer chaining a bunch of them together).
    // https://p5js.org/reference/p5/bezierVertex/
    for (const index in allBeziers) {
        const beziers = allBeziers[index];
        for (let i = 0; i < beziers.length / 2; i++) {
            // Group beziers into pairs so that they can
            const bezierA = beziers[i];
            const bezierB = beziers[beziers.length - (i + 1)];

            // Find a formula to determine color
            const hue = baseHue + (Math.sin(hueMod) * i * hueModIntensity);
            // hue can be from 0 to 360
            // hue should change over time
            // there should be an offset between vertical and horizontal beziers controlled by a value
            // there should be an offset between pairs of bezier controlled by a value
            const color = p.color(hue, 100, 100, 20)
            p.fill(color) // TRY INCLUDING MORE FILLS PARTWAY THROUGH BEGINSHAPE. MIGHT LOOK COOL. EXAMPLE: https://p5js.org/reference/p5/clip/

            p.beginShape();
            // Display Bezier A
            p.vertex(bezierA.pointA[0], bezierA.pointA[1]);
            p.bezierVertex(bezierA.controlA[0], bezierA.controlA[1]);
            p.bezierVertex(bezierA.controlB[0], bezierA.controlB[1]);
            p.bezierVertex(bezierA.pointB[0], bezierA.pointB[1]);

            // Display Bezier B (has connecting lines at each end to Bezier A)
            p.vertex(bezierB.pointB[0], bezierB.pointB[1]);
            p.bezierVertex(bezierB.controlB[0], bezierB.controlB[1]);
            p.bezierVertex(bezierB.controlA[0], bezierB.controlA[1]);
            p.bezierVertex(bezierB.pointA[0], bezierB.pointA[1]);

            p.endShape(p.CLOSE);
        }
    }
}