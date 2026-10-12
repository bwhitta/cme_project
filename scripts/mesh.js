const horizLines = 6;
const vertLines = 6;

const canvasWidth = 600;
const canvasHeight = 600;

export function setupMesh(parent) {
    new p5(sketch, parent);
}
function sketch(p) {
    p.setup = function () {
        p.createCanvas(canvasWidth, canvasHeight);
        p.colorMode(p.HSB);
    }
    p.draw = function () {
        p.background(225);

        const allBeziers = getMeshVertices();
        displayMesh(p, allBeziers)
    };
}
function getMeshVertices() {
    // Each element within this should have two points (for the start and end of the bezier)
    const horizBeziers = []
    // Create horizontal beziers
    for (let i = 0; i < horizLines; i++) {
        const bezier = {};

        // could make this be on a curve or something so that the points can be scrunched towards one end (doesn't have to stay at the exact same total height difference)
        const y = ((i + 1) / (horizLines + 1)) * canvasHeight;

        // Determines where the control points for the bezier will be
        const vertOffset = 50;
        const horizOffset = 100;

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
        const x = ((i + 1) / (vertLines + 1)) * canvasHeight;

        // Determines where the control points for the bezier will be
        const vertOffset = 100;
        const horizOffset = -50;

        bezier.pointA = [x, 0];
        bezier.pointB = [x, canvasHeight];
        bezier.controlA = [x + horizOffset, 0 + vertOffset];
        bezier.controlB = [x - horizOffset, canvasHeight - vertOffset];

        vertBeziers.push(bezier);
    }

    return [horizBeziers, vertBeziers];
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

            // hue can be from 0 to 360
            // hue should change over time
            // there should be an offset between vertical and horizontal beziers controlled by a value
            // there should be an offset between pairs of bezier controlled by a value
            const color = p.color(0, 100, 100, 0.2)
            p.fill(color)

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