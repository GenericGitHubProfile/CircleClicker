import { Shape } from './shape.mjs';

export class Circle extends Shape {
    constructor(x, y, rad) {
        super(x,y);
        this.rad = rad;
        this.lineCol = null;
        this.fillCol = null;
    }

    draw(c, fillCol='#000', lineCol=fillCol) {
        c.beginPath();
        this.fillCol = fillCol;
        this.lineCol = lineCol;
        c.strokeStyle = lineCol;
        c.fillStyle = fillCol;

        c.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
        c.fill();
        c.stroke();
    }
}
