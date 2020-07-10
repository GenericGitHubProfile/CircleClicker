'use strict';
import { Square } from './utilities/square.mjs';
import { Circle } from './utilities/circle.mjs';

let score = document.getElementById('score');

const BG_COL = '#e0ffff';

let curScore = 0;
const SCORE_COORDS = {x: 95, y: 15};

let noCircles = 0;
const NOCIRCLES_COORDS = {x: 95, y: 35};

let canvas = document.createElement('canvas');
let c = canvas.getContext('2d');
canvas.id="canvas";
canvas.width = "1000";
canvas.height = "650";

// ctx.font = "30px Arial";
// ctx.strokeText("Hello World", 10, 50);
c.font = "16px Arial";
c.fillText("Score: ", 10, 15);
c.fillText(`${curScore}`, SCORE_COORDS.x, SCORE_COORDS.y);

c.fillText("No Circles: ", 10, 35);
c.fillText(`${noCircles}`, NOCIRCLES_COORDS.x, NOCIRCLES_COORDS.y);

document.getElementById('canvasSpace').appendChild(canvas);

let border = new Square(0,50, 1000, 600);
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
            updateNoCircles(-1);
            shapeArr.splice(i,1);
            redraw();
        }
    });
});

setInterval(spawnCircles, 50);

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
    curScore++;
    c.clearRect(SCORE_COORDS.x, SCORE_COORDS.y-15, 100, 20);
    c.fillStyle = '#000';
    c.fillText(`${curScore}`, SCORE_COORDS.x, SCORE_COORDS.y);
}

function redraw() {
    let temp = new Square(0, 50, canvas.width, canvas.height);
    temp.draw(c, BG_COL);
    shapeArr.forEach((item, i) => {
        item.draw(c, item.fillCol);
    });
}

function spawnCircles() {
    if(shapeArr.length > 499) {
        return;
    }
    let temp = new Circle(randNo(20,960),randNo(70,560),10);
    temp.draw(c, randCol());
    shapeArr.push(temp);
    updateNoCircles(1);
}

function updateNoCircles(change) {
    noCircles += change;
    c.fillStyle = ((noCircles<30) ? '#22aa22' : '#aa2222');
    c.clearRect(NOCIRCLES_COORDS.x, NOCIRCLES_COORDS.y-15, 100, 20);
    c.fillText(`${noCircles}`, NOCIRCLES_COORDS.x, NOCIRCLES_COORDS.y);
}
