//import "../libraries/p5-matter";

export function setupPhysics(wrapElement) {
    // Set stuff up
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: wrapElement,
        engine: engine
    });
    render.options.wireframes = false;
    render.options.background = "transparent";


    // Create objects and add them to the world
    const boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    const boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: "transparent" } });
    Matter.Composite.add(engine.world, [boxA, boxB, ground]);

    Matter.Render.run(render);
    var runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    function sketch(p) {
        // matterjs stuff
        const engine = Matter.Engine.create();
        const render = Matter.Render.create({
            element: parent,
            engine: engine
        });

        p.setup = function () {
            // put setup code here.
            p.createCanvas(600, 600);
            p.background(225);
        }
        p.draw = function () {

        }
    }
}