import { Circle } from './circle.mjs';
import { Square } from './square.mjs';
import { Sound } from './Sound.mjs';

export class Game {
    constructor(doc, canvasHolder, width = 1000, height = 650) {

        // Canvas Initialisation
        this.canvas = doc.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = 'canvas';
        // These are made into constants for box to spawn circles inside, etc.
        this.WIDTH = width;
        this.HEIGHT = height;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        // Add it to the page
        canvasHolder.appendChild(this.canvas);

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

        // Initialise Sound
        this.popSlow = new Sound('./sounds/plopSlow.mp3', doc);
        this.popMed = new Sound('./sounds/plopMed.mp3', doc);
        this.popFast = new Sound('./sounds/plopFast.mp3', doc);

        // Other constants
        this.CIRCLE_DIST = 11;
        this.MAX_CIRCLES = 50;
        this.spawning = false;

        this.setupGame();
    }

    /*
    * Set the game state and setup when to start the game
    * this will be later be done with an event listener so the user can select the difficulty
    */
    setupGame() {
        this.gameState = this.GAME_STATES.PREGAME;
        this.selectDifficulty();
        this.startGame();
    }

    /*
    * Start the main Game with the set variables
    * Adds score and no circle counters, so the user can track how well they are doing
    * clears the main screen and then starts spawning circles and allows them to be clicked
    */
    startGame() {
        this.gameState = this.GAME_STATES.MAIN;

        // Setup scoring and noCircle tracking
        this.ctx.fillStyle = '#000';
        this.ctx.fillText("Score: ", 10, 15);
        this.ctx.fillText("No Circles: ", 10, 35);
        this.displayScore();
        let border = new Square(0,50,this.WIDTH,this.HEIGHT);
        border.draw(this.ctx,this.BG_COL);
        // Add the interactive componants
        this.startSpawningCircles();
        this.canvas.addEventListener('click', this.canvasClickEvent.bind(null, this), false);
    }

    /*
    * When the Number of circles would exceed the max number (currently 50)
    * wipe the screen and display the final score
    */
    endGame() {
        this.gameState = this.GAME_STATES.END;
        console.log(this.gameState);

        // Remove interactive componants
        this.stopSpawningCircles();
        this.canvas.removeEventListener('click', this.canvasClickEvent.bind(null, this), false);

        this.shapeArr = [];

        // Clear Screen
        let temp = new Square(0,0, this.canvas.width, this.canvas.height);
        temp.draw(this.ctx, this.BG_COL);

        // Display final score
        this.ctx.fillStyle = "#000";
        this.ctx.font = "100px Arial";
        this.ctx.fillText(`FINAL SCORE: ${this.score}`, 130, 280);
        this.ctx.font = "40px Arial";
        this.ctx.fillText(`Play Again?`, 400, 370);
    }

    /*
    * Will setup screen with difficulties to select with event listener and screen region
    * currently sets the difficulty to medium
    */
    selectDifficulty() {
        this.difficulty = this.GAME_DIFFICULTY.HARD;
    }

    /*
    * Increments and displays the score to user
    */
    increaseScore() {
        this.score++;
        this.displayScore();
    }

    /*
    * Displays score to user
    */
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

    /*
    * Displays number of circles to user
    */
    displayNoCircles() {
        this.ctx.fillStyle = ((this.noCircles<this.MAX_CIRCLES*0.6) ? this.CIRCLES_SAFE : this.CIRCLES_WARN);
        this.ctx.clearRect(this.NOCIRCLES_COORDS.x, this.NOCIRCLES_COORDS.y-15, 100, 20);
        this.ctx.fillText(`${this.noCircles}`, this.NOCIRCLES_COORDS.x, this.NOCIRCLES_COORDS.y);
    }

    /*
    * Adds interval for spawning circles, interval based on difficulty selected
    */
    startSpawningCircles() {
        this.spawning = setInterval(() => this.spawnCircles(), this.difficulty);
    }

    /*
    * Spawns circles and handles whether the user has lost or not
    */
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

    /*
    * Stops the circles from spawning
    */
    stopSpawningCircles() {
        clearInterval(this.spawning);
    }

    /*
    * Function for event listener of clicking on the canvas
    * checks whether a circle is within distance, if so removes it and redraws the screen
    */
    canvasClickEvent(obj, e) {
        // Get bounding box of Canvas element
        const RECT = obj.canvas.getBoundingClientRect();
        // Get the X from the left side of the canvas, rather than left side of screen
        const X = e.clientX - RECT.left;
        // Get the Y from the top of the canvas, rather than the top of the screen
        const Y = e.clientY - RECT.top;
        // Iterate through all circles
        obj.shapeArr.forEach((item, i) => {
            let dist = obj.getDistance(item.x,item.y,X,Y);
            // If current circle is whitin distance, remove it, give score, and reduce number of circles, then redraw screen
            if(dist < obj.CIRCLE_DIST) {
                obj.increaseScore();
                obj.updateNoCircles(-1);
                obj.shapeArr.splice(i,1);
                obj.playPop(Math.floor(Math.random() * 3));
                obj.redraw();
            }
        });
    }

    /*
    * Clears screen then redraws all circles
    */
    redraw() {
        let temp = new Square(0,50, this.canvas.width, this.canvas.height);
        temp.draw(this.ctx, this.BG_COL);
        this.shapeArr.forEach((item, i) => {
            item.draw(this.ctx, item.fillCol);
        });

    }

    /*
    * Plays a pop sound based on the given value
    * Should only be 1, 2 or 3
    */
    playPop(num) {
        switch (num) {
            case 1:
                this.popSlow.play();
                break;
            case 2:
                this.popMed.play();
                break;
            case 3:
                this.popFast.play();
                break;
        }
        return;
    }

    /*
    * Returns a random number between the given min and max parameters
    */
    randNo(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    /*
    * Returns a random hex colour
    */
    randCol() {
        return '#' + ('000000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    }

    /*
    * Returns the distance between two given points
    */
    getDistance(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    }
}
