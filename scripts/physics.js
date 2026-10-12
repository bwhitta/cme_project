let engine;
let render;
let font;
let p5font;
const fontPath = "../assets/EBGaramond-VariableFont_wght.ttf";
const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""); //ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
const charVertices = {};

let framesSinceSummon = 0;
const framesBetweenSummons = 60;

export function setupPhysics(wrapElement) {
    engine = Matter.Engine.create();
    engine.gravity.y = 0;
    render = Matter.Render.create({
        element: wrapElement,
        engine: engine,
        options: {
            height: 400,
            width: 400
        }
    });
    //render.options.wireframes = false;
    //render.options.background = "#d2d2d2";

    // Await setting up font stuff
    const buffer = fetch(fontPath).then(res => res.arrayBuffer());
    buffer.then(data => {
        font = opentype.parse(data);
        new p5(sketch, wrapElement);
    })
}

function sketch(p) {
    const letters = [];
    addEventListener("keydown", (event) => {
        const key = event.key;
        if (p5font == null) return;
        if (!allowedChars.includes(key)) return;

        const physObj = summonShape(charVertices[key].vertices[0], 200, 100);
        console.log(key)
        letters.push({ key: key, physObj: physObj });
    })

    // Add the ground
    const ground = Matter.Bodies.rectangle(200, 425, 400, 50, { isStatic: true, render: { fillStyle: "transparent" } });
    Matter.Composite.add(engine.world, ground);

    // Start simulating
    Matter.Render.run(render);
    var runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    p.setup = function () {
        p.createCanvas(400, 400);
        p.loadFont(fontPath, font => {
            p.textFont(font);
            p5font = font;
            calculateVertices(p);
        });

        p.textSize(100);
        p.textAlign(p.CENTER, p.CENTER);
    }
    p.draw = function () {
        p.background(225);
        drawPhysicsObjects(p, letters);
    }
}
function drawPhysicsObjects(p, letters) {
    for (const i in letters) {
        const key = letters[i].key;
        const physObj = letters[i].physObj;
        const pos = physObj.position;

        const vertices = charVertices[key];
        console.log(vertices)

        p.fill("black");

        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(physObj.angle);
        p.text(key, 0, 0);
        p.pop();

        p.fill("white");
        p.circle(pos.x, pos.y, 10);
    }
}
function calculateVertices(p) {
    for (const char of allowedChars) {
        const vertices = p5font.textToContours(char, 0, 0, { sampleFactor: 0.1 });
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
    const letterBody = Matter.Bodies.fromVertices(x, y, vertices, { render: { fillStyle: "goldenrod", lineWidth: 1, strokeStyle: "goldenrod" }, density: 0.1 })
    //Matter.Body.scale(letterBody, 0.1, 0.1);
    //Matter.Body.setMass(letterBody, 1);
    //Matter.Body.setInertia(letterBody, 500);
    Matter.Composite.add(engine.world, letterBody);
    return letterBody;
}