
export function setupLetterPhysics(wrapElement) {
    const filepath = "../assets/EBGaramond-VariableFont_wght.ttf";
    const buffer = fetch(filepath).then(res => res.arrayBuffer());
    buffer.then(data => {
        const font = opentype.parse(data);
        letterPhysics(wrapElement, font);
    })
}

function letterPhysics(wrapElement, font) {
    // Module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;

    // Create the engine
    var engine = Engine.create({
        enableSleeping: false
    });
    // Create the renderer
    var render = Render.create({
        element: wrapElement,
        engine: engine
    });
    // consider using: https://palmerpaul.com/p5-matter/

    // Basics settings
    render.options.wireframes = false;
    render.options.background = "transparent";

    /*const letters = "wrtyusfhklzxcvnmWETYISFGHJKLZXCVN"
    const startingLetters = 5;
    for (let i = 0; i < startingLetters; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)]
        createLetter(letter, i * 75 + 25, 100);
    }*/

    addEventListener("keydown", (event) => {
        const key = event.key

        const vertices = getLetterVertices(key, font, 450, 100)
        if (vertices != null) {
            summonShape(vertices, 400, 100, Bodies, Composite, engine)
        }
    })

    // create objects
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: "transparent" } });

    // Add all of the bodies to the world
    Composite.add(engine.world, [/*boxA, boxB, */ground]);

    // Run the renderer
    Render.run(render);

    // Create runner
    var runner = Runner.create();

    // Run the engine
    Runner.run(runner, engine);
}
function getLetterVertices(letter, font) {
    const letterObject = Array.from(font.glyphs).find((f) => f.name === letter);
    if (letterObject == null) {
        console.log("No object for letter");
        return
    }

    const letterPoints = letterObject.points;
    const vertices = [];
    for (let i = 0; i < letterPoints.length; i++) {
        const point = letterPoints[i]
        vertices.push({ x: point.x, y: -point.y })

        if (point.lastPointOfContour) {
            break;
        }
    }
    return vertices;
}
function summonShape(vertices, x, y, Bodies, Composite, engine) {
    const letterBody = Bodies.fromVertices(x, y, vertices, { render: { fillStyle: "goldenrod", lineWidth: 1, strokeStyle: "goldenrod" }, density: 0.1 })
    Matter.Body.scale(letterBody, 0.2, 0.2);
    Matter.Body.setMass(letterBody, 10);
    Matter.Body.setInertia(letterBody, 5000);
    Composite.add(engine.world, letterBody);
}