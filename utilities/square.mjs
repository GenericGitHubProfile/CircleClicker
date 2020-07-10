import { Shape } from './shape.mjs';

export class Square extends Shape {
    constructor(x,y, width, height=width) {
        super(x,y);
        this.width = width;
        this.height = height;
        this.fillCol = null;
        this.lineCol = null;
    }

    draw(c, fillCol='#000', lineCol=fillCol) {
        this.fillCol = fillCol;
        this.lineCol = lineCol;
        c.strokeStyle = lineCol;
        c.fillStyle = fillCol;

        c.fillRect(this.x,this.y,this.width,this.height);
        c.stroke();
    }
}
