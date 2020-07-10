'use strict';
import { Square } from './utilities/square.mjs';
import { Circle } from './utilities/circle.mjs';

let score = document.getElementById('score');

const BG_COL = '#e0ffff';

let canvas = document.createElement('canvas');
let c = canvas.getContext('2d');
canvas.id="canvas";
canvas.width = "1000";
canvas.height = "600";

document.getElementById('canvasSpace').appendChild(canvas);

let border = new Square(1,1, 1000, 600);
border.draw(c,BG_COL);

let shapeArr = [];

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    shapeArr.forEach((item, i) => {
        let dist = getDistance(item.x, item.y, x, y);
        if (dist < 10) {
            increaseScore();
            shapeArr.splice(i,1);
            redraw();
        }
    });
});

setInterval(spawnCircles, 500);

function randNo(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function randCol() {
    return "#" + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
}

function getDistance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function increaseScore() {
    let curScore = eval(score.textContent);
    score.textContent = `${++curScore}`;
}

function redraw() {
    let temp = new Square(0, 0, canvas.width, canvas.height);
    temp.draw(c, BG_COL);
    shapeArr.forEach((item, i) => {
        item.draw(c, item.fillCol);
    });
}

function spawnCircles() {
    if(shapeArr.length > 49) {
        return;
    }
    let temp = new Circle(randNo(20,960),randNo(20,560),10);
    temp.draw(c, randCol());
    shapeArr.push(temp);
}
