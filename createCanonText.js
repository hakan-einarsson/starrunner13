import { Text } from 'kontra';
import { baseUnit } from './constants';

const createCanonText = (text, x, y, type) => {
    return new Text({
        text: text,
        font: '20px Arial',
        color: 'white',
        x: type === 'vertical' ? x + 3 : x,

        y: y,
        squareSize: baseUnit,
        fontOffset: 5,
        type: type,
        inTransition: false,

        update: function (dt) {
            if (this.inTransition) {
                const step = (8 / (1 - dt)) * 59 / 60;
                if (type === 'horizontal') {
                    this.x -= step;
                    const realX = this.x + this.fontOffset - this.squareSize / 2;
                    if (realX % baseUnit <= step) {
                        this.x = Math.round(realX / baseUnit) * baseUnit + this.squareSize / 2 - this.fontOffset;
                        this.inTransition = false;
                    }
                }
                else {
                    this.y -= step;
                    const realY = this.y - this.squareSize / 2 + this.fontOffset * 2;
                    if (realY % baseUnit <= step) {
                        this.y = Math.round(realY / baseUnit) * baseUnit + this.squareSize / 2 - this.fontOffset * 2;
                        this.inTransition = false;
                    }
                }
            }
        }
    });
}

export default createCanonText;