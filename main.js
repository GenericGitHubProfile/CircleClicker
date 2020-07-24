'use strict';
import { Game } from './utilities/game.mjs';

let canvas = document.createElement('canvas');
let canvasHolder = document.getElementById('canvasSpace');

let clickGame = new Game(document, canvasHolder);
