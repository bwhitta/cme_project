let engine;
let font;
const fontPath = "assets/EBGaramond-VariableFont_wght.ttf";
const allowedChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()`~-_=+[{]}\\|;:'\",<.>/?".split(""); //ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
const charVertices = {};
const canvasHeight = 800;
let render;
const useMatterRenderer = false;

let framesSinceSummon = 0;
const framesBetweenSummons = 10;

export function setupPhysics(wrapElement) {
    engine = Matter.Engine.create();
    // p5.js is used to render the letters instead of matter, but I've just commented this out for testing purposes
    if (useMatterRenderer) {
        render = Matter.Render.create({
            element: wrapElement,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: canvasHeight
            }
        });
    }

    new p5(sketch, wrapElement);
}

function sketch(p) {
    const letters = [];

    // Listen for keystrokes
    addEventListener("keydown", (event) => {
        const key = event.key;

        // Make sure the font is loaded and that the key is valid to display
        if (font == null) return;
        if (key.length != 1 || !allowedChars.includes(key)) return;
        if (framesSinceSummon >= framesBetweenSummons) {
            const physObj = summonShape(charVertices[key].vertices, p.width / 2, 100);
            letters.push({ key: key, physObj: physObj });
            framesSinceSummon = 0;
        }
    })
    p.setup = function () {
        p.createCanvas(p.windowWidth, canvasHeight);

        p.loadFont(fontPath, loadedFont => {
            p.textFont(loadedFont);
            font = loadedFont;
            calculateVertices();
        });

        p.textSize(100);
        p.textAlign(p.CENTER, p.CENTER);

        // The Matter renderer is not used but left for testing. p5.js is instead used for rendering
        if (useMatterRenderer) Matter.Render.run(render);
        // Start simulating
        var runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        // Add the ground (makes it way wider than necessary in case the window is resized)
        const ground = Matter.Bodies.rectangle(2000, p.height, 4000, 50, { isStatic: true });
        Matter.Composite.add(engine.world, ground);
    }
    p.draw = function () {
        framesSinceSummon++;
        p.background(225);
        drawPhysicsObjects(p, letters);
    }
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, canvasHeight)
    }
}
function drawPhysicsObjects(p, letters) {
    for (const i in letters) {
        const key = letters[i].key;
        const physObj = letters[i].physObj;
        const pos = physObj.position;

        const vertices = charVertices[key];

        p.fill("black");

        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(physObj.angle);
        p.text(key, -vertices.x, -vertices.y);
        p.pop();
    }
}
function calculateVertices() {
    for (const char of allowedChars) {
        const vertices = font.textToContours(char, 0, 0, { sampleFactor: 0.1 });
        const xValues = vertices.flat().map(f => f.x);
        const xCenter = (Math.max(...xValues) + Math.min(...xValues)) / 2;
        const yValues = vertices.flat().map(f => f.y);
        const yCenter = (Math.max(...yValues) + Math.min(...yValues)) / 2;

        charVertices[char] = {
            vertices: vertices,
            x: xCenter,
            y: yCenter
        }
    }
}
function summonShape(vertices, x, y) {
    // Just uses the hull (removing any concave parts) for colission, since using the full model is insanely buggy.
    // I'd love to have full proper colission for all of this, but I've already spent far too many hours on this one pretty minor detail and so I have to move on
    // Rather than just using the first layer I can flatten the list of vertices (effectively taking the lists nested within vertices and turning them into one big list) and work from there, since the inner points are removed by Matter.Vertices.Hull() anyways.
    const updatedVertices = Matter.Vertices.hull(Matter.Vertices.create(vertices.flat()));
    const physObj = Matter.Bodies.fromVertices(x, y, updatedVertices, { render: { fillStyle: "goldenrod", lineWidth: 1, strokeStyle: "goldenrod" }, friction: 15 })

    Matter.Composite.add(engine.world, physObj);
    return physObj;
}