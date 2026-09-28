// Temporary way of reading user input
const control1 = document.getElementById("control1");
const control2 = document.getElementById("control2");
const control3 = document.getElementById("control3");
const control4 = document.getElementById("control4");

// Read button inputs
document.getElementById("toggle-control-points").addEventListener("click", toggleControlPoints);
function toggleControlPoints() {
    console.log("toggling control points");
    showControlPoints = !showControlPoints;
}

let rotation = 0;
const rotationSpeed = 0;

let rotationOffset;

let amplitudeSlope;
const amplitudeSlopeMult = 2;
const totalBaseAmplitude = 150;
const baseAmplitudeChange = 1;

let amplitudeVariance;
const varianceMinMult = 0.5;
const varianceMaxMult = 1;

let controlDistance;
const minControlDistance = 5;
const maxControlDistance = 15;

const vertexCount = 12;
const waveformCount = 6;
const canvasCenterX = 200;
const canvasCenterY = 200;

// Toggles (will likely later be controlled by things like buttons)
let showControlPoints = false;

// Instancing like this is more hassle than just directly using p5, but allows for multiple canvases.
export function setupWaveforms(parent) {
    new p5(sketch, parent);
}
function sketch(p) {
    p.setup = function () {
        p.createCanvas(400, 400);
        p.fill("transparent");
    }
    p.draw = function () {
        // Clear background
        p.clear()

        // Update rotation
        rotation += p.radians(rotationSpeed);
        updateValues()

        // Calculate positions for each
        let currentAmplitude = 0;
        for (let i = 0; i < waveformCount; i++) {
            // Get the coords of each point in the wayform
            currentAmplitude += amplitudeOffset(i, currentAmplitude);
            const waveformRotation = (i * rotationOffset) + rotation;
            const vertices = waveformCoords(currentAmplitude, waveformRotation);

            // Display the waveform and its control points
            renderWaveform(p, vertices);

            // Display the control points
            console.warn("Toggle for control points is not yet implemented")
            if (showControlPoints) {
                // Once masking is added, I might add
                renderControlPoints(p, vertices);
            }
        }
    }
}
function updateValues() {
    // Code like Number(controlX.value) will be replaced once the new input system is set up

    // Value between -1 and 1
    amplitudeSlope = (Number(control1.value) / 50) - 1;
    // Value between varianceMinMult and varianceMaxMult
    amplitudeVariance = ((varianceMaxMult - varianceMinMult) * Number(control2.value) / 100) + varianceMinMult;
    // Value between 0 and 2pi/6 radians (equal to 0 and 360/6 degrees)
    rotationOffset = (Number(control3.value) / 100) * (2 * Math.PI / 6);
    // Value between minControlDistance and maxControlDistance
    controlDistance = ((maxControlDistance - minControlDistance) * Number(control4.value) / 100) + minControlDistance;

    // should probably merge amplitude and amplitude offset, and then add an new one which is the amplitude offset relative to other in the same waveform
    // negative values of this could affect every third one and positive are every second?
    // would need to adjust the rotation offset stuff to make the min vs max offset difference equal to 3x as much as it is now

    // y values of points should be soft-capped to a certain Y value (maybe 100? will need to change when increase canvas size)
}
function amplitudeOffset(i) {
    // Desmos chart I made for figuring out amplitude math stuff: https://www.desmos.com/calculator/bi5jwqy8y6. This system is almost certainly more complex than is necessary but I made it pretty quickly just through messing around
    // Alternative system: https://www.desmos.com/calculator/jg5c82brzm
    // Initially I thought I would need to use exponents to make the wave offset stuff feel cool but I believe it's unnecessary since each waveform's amplitude stacks on top of the amplitude previous, making a linear increment in sizes work just as well.

    const waveformProgressPct = (i + 1) / (waveformCount + 1);
    const centerX = 0.5;
    const centerY = 1;
    const slope = amplitudeSlope * amplitudeSlopeMult;
    const amplitudeDifferencePct = (slope * (waveformProgressPct - centerX)) + centerY;
    const amplitudeDifference = amplitudeDifferencePct * totalBaseAmplitude / (waveformCount);
    // Could add some stuff that affects the final amplitude. Maybe the overall size pulsates over time?
    return amplitudeDifference;
}
function waveformCoords(amplitude, rotation) {
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
        const vertex = {}
        const angle = rotation + (i * 2 * Math.PI / vertexCount)
        const pointAmplitude = i % 2 == 0 ? amplitude : amplitude * amplitudeVariance;

        // Get the point's position
        const x = canvasCenterX + (pointAmplitude * Math.cos(angle));
        const y = canvasCenterY + (pointAmplitude * Math.sin(angle));
        vertex.point = [x, y];

        // Get the direction of its two controlPoints
        const controlDistMult = amplitude / 50;
        const controlX = controlDistance * Math.sin(angle) * controlDistMult;
        const controlY = controlDistance * Math.cos(angle) * controlDistMult;
        vertex.controlPoints = [[x - controlX, y + controlY], [x + controlX, y - controlY]]
        vertices.push(vertex);
    }
    return vertices;
}
function renderControlPoints(p, vertices) {
    p.strokeWeight(2);
    p.stroke("blue");
    for (let i in vertices) {
        const vertex = vertices[i];
        p.point(vertex.controlPoints[0][0], vertex.controlPoints[0][1]);
        p.point(vertex.controlPoints[1][0], vertex.controlPoints[1][1]);
    }
    p.strokeWeight(1);
    p.stroke("black")
}
function renderWaveform(p, vertices) {
    // https://p5js.org/reference/p5/bezierVertex/
    p.strokeWeight(1);
    p.stroke("red");

    p.beginShape();
    // The first point needs to only be defined for the first bezier, since successive beziers re-use the last point of the previous one
    p.bezierVertex(vertices[0].point[0], vertices[0].point[1]);
    for (let i = 0; i < vertexCount; i++) {
        const vertex = vertices[i];
        const nextVertex = vertices[(i + 1) % vertexCount];
        p.bezierVertex(vertex.controlPoints[0][0], vertex.controlPoints[0][1]);
        p.bezierVertex(nextVertex.controlPoints[1][0], nextVertex.controlPoints[1][1]);
        p.bezierVertex(nextVertex.point[0], nextVertex.point[1]);
    }
    p.endShape();

    p.strokeWeight(1);
    p.stroke("black")
}