
// NEED TO IMPORT THIS IN HEAD TO USE
// <script src="https://cdn.jsdelivr.net/npm/opentype.js"></script>

const filepath = "../assets/CrimsonText-Regular.ttf";
const buffer = fetch(filepath).then(res => res.arrayBuffer());
buffer.then(data => {
    const font = opentype.parse(data);
    letterPhysics(document.getElementById("matter-letters-wrap"), font);
})

function letterPhysics(wrapElement, font) {
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        element: wrapElement,
        engine: engine
    });

    // some possible similar projects:
    render.options.wireframes = false;
    render.options.background = "transparent";

    // letter stuff
    console.log(font)

    const letters = "wrtyusfhklzxcvnmWETYISFGHJKLZXCVN"
    const startingLetters = 5;
    for (let i = 0; i < startingLetters; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)]
        createLetter(letter, i * 75 + 25, 100);
    }

    function createLetter(letter, x, y) {
        const letterObject = Array.from(font.glyphs).find((f) => f.name === letter);
        if (letterObject == null) {
            return
        }
        const letterPoints = letterObject.points;
        const letterVertices = [];
        let temp = false;
        for (let i = 0; i < letterPoints.length; i++) {
            const point = letterPoints[i]
            letterVertices.push({ x: point.x, y: -point.y })
            if (point.lastPointOfContour) {
                break;
            }
        }

        const letterBody = Bodies.fromVertices(x, y, letterVertices, { render: { fillStyle: "goldenrod", lineWidth: 1, strokeStyle: "goldenrod" } })
        Matter.Body.scale(letterBody, 0.1, 0.1)
        Composite.add(engine.world, letterBody)
    }

    addEventListener("keydown", (event) => {
        const key = event.key
        console.log(key)
        createLetter(key, 100, 100)
    })


    // create objects
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: "transparent" } });

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}