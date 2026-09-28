import { Crank } from "./crank.js";
import {setupPhysics} from "./physics.js";
import {setupWaveforms} from "./radial_waveforms.js";
//import "./letter_physics.js"

// installed http server using using: npm install http-server --global
// install: npm install live-server -g
// run: live-server
// to run server, get to project root directory and use: http-server


new Crank(document.getElementById("crank-handle"));

setupPhysics(document.getElementById("matter-letters-wrap"));

setupWaveforms(document.getElementById("waveform-wrap"));