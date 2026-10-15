//import { Crank } from "./crank.js";
import {setupWaveforms} from "./radial_waveforms.js";
import {setupPhysics} from "./physics.js";
import {setupMesh} from "./mesh.js";

// installing: npm install live-server -g
// to run, use this command at the project root: live-server

// Removed to reduce scope and keep theming more consistent.
//new Crank(document.getElementById("crank-handle"));

setupPhysics(document.getElementById("matter-letters-wrap"));

setupWaveforms(document.getElementById("waveform-wrap"));

setupMesh(document.getElementById("mesh-wrap"));