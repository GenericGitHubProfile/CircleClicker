import { Circle } from './circle.mjs';
import { Square } from './square.mjs';

export class Game {
    constructor(canvas, canvasHolder, width = 1000, height = 650) {

        // Canvas Initialisation
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = 'canvas';
        this.WIDTH = width;
        this.HEIGHT = height;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        // Add it to the page
        canvasHolder.appendChild(canvas);

        // Displayed information Initialisation
        this.score = 0;
        this.noCircles = 0;
        this.shapeArr = [];
        this.ctx.font = '16px Arial';

        // Game states Initialisation
        this.GAME_STATES = Object.freeze({
            PREGAME: "PREGAME",
            MAIN: "MAIN",
            END: "END"
        });
        this.gameState = null;

        // Game difficulty Initialisation
        // Each difficulty is the speed (ms) which the circles appear
        this.GAME_DIFFICULTY = Object.freeze({
            EASY: "800",
            MEDIUM: "500",
            HARD: "300"
        });
        this.difficulty = null;

        // Colours Initialisation
        this.BG_COL = '#e0ffff';
        this.CIRCLES_SAFE = '#22AA22';
        this.CIRCLES_WARN = '#AA2222';

        // Display Info Initialisation
        this.SCORE_COORDS = {x: 95, y: 15};
        this.NOCIRCLES_COORDS = {x: 95, y: 35};

        // Other constants
        this.CIRCLE_DIST = 11;
        this.MAX_CIRCLES = 50;
        this.spawning = false;

        this.setupGame();
    }

    setupGame() {
        this.gameState = this.GAME_STATES.PREGAME;
        this.selectDifficulty();
    }

    startGame() {
        this.gameState = this.GAME_STATES.MAIN;

        this.startSpawningCircles();
        this.ctx.fillStyle = '#000';
        this.ctx.fillText("Score: ", 10, 15);
        this.ctx.fillText("No Circles: ", 10, 35);
        this.displayScore();
        let border = new Square(0,50,this.WIDTH,this.HEIGHT);
        border.draw(this.ctx,this.BG_COL);
        this.canvas.addEventListener('click', this.canvasClickEvent.bind(null, this), false);
    }

    endGame() {
        this.gameState = this.GAME_STATES.END;

        this.stopSpawningCircles();
        this.canvas.removeEventListener('click', this.canvasClickEvent.bind(null, this), false);

        let temp = new Square(0,0, this.canvas.width, this.canvas.height);
        temp.draw(this.ctx, this.BG_COL);

        this.ctx.font = "60px Arial";
        this.ctx.fillText(`FINAL SCORE ${this.score}`, 200, 300);
    }

    selectDifficulty() {
        this.difficulty = this.GAME_DIFFICULTY.MEDIUM;
        this.startGame();
    }

    increaseScore() {
        this.score++;
        this.displayScore();
    }

    displayScore() {
        this.ctx.clearRect(this.SCORE_COORDS.x, this.SCORE_COORDS.y-15, 100, 20);
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(`${this.score}`, this.SCORE_COORDS.x, this.SCORE_COORDS.y);
    }

    /*
    * Changes number of circles in UI element
    * Parameter change should be either 1 or -1
    */
    updateNoCircles(change) {
        this.noCircles += change;
        this.displayNoCircles();
        return this.noCircles;
    }

    displayNoCircles() {
        this.ctx.fillStyle = ((this.noCircles<this.MAX_CIRCLES*0.6) ? this.CIRCLES_SAFE : this.CIRCLES_WARN);
        this.ctx.clearRect(this.NOCIRCLES_COORDS.x, this.NOCIRCLES_COORDS.y-15, 100, 20);
        this.ctx.fillText(`${this.noCircles}`, this.NOCIRCLES_COORDS.x, this.NOCIRCLES_COORDS.y);
    }

    startSpawningCircles() {
        this.spawning = setInterval(() => this.spawnCircles(), this.difficulty);
    }

    spawnCircles() {
        if(this.shapeArr.length >= this.MAX_CIRCLES) {
            // LOSE CONDITION
            this.endGame();
            return;
        }
        let temp = new Circle(this.randNo(20,960),this.randNo(70,560),this.CIRCLE_DIST-1);
        temp.draw(this.ctx, this.randCol());
        this.shapeArr.push(temp);
        this.updateNoCircles(1);
    }

    stopSpawningCircles() {
        clearInterval(this.spawning);
    }

    canvasClickEvent(obj, e) {
        const RECT = canvas.getBoundingClientRect();
        const X = e.clientX - RECT.left;
        const Y = e.clientY - RECT.top;
        obj.shapeArr.forEach((item, i) => {
            let dist = obj.getDistance(item.x,item.y,X,Y);
            if(dist < obj.CIRCLE_DIST) {
                obj.increaseScore();
                obj.updateNoCircles(-1);
                obj.shapeArr.splice(i,1);
                obj.redraw();
            }
        });
    }

    redraw() {
        let temp = new Square(0,50, this.canvas.width, this.canvas.height);
        temp.draw(this.ctx, this.BG_COL);
        this.shapeArr.forEach((item, i) => {
            item.draw(this.ctx, item.fillCol);
        });

    }

    randNo(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    randCol() {
        return '#' + ('000000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    }

    getDistance(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    }
}
