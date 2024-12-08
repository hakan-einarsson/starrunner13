import { Text } from 'kontra'
import { baseUnit } from './constants';
import { drawRoundedRect } from './drawUtils';

const createTextBoard = (x, text) => {
    return Text({
        x: x,
        y: baseUnit * 8 + baseUnit / 4,
        amount: 0,
        text: `${text}: `,
        color: 'white',
        font: '20px Arial',
        width: baseUnit,
        setAmount: function (amount) {
            this.amount = amount;
        },
        render: function () {
            this.context.lineWidth = 2;
            this.context.strokeStyle = 'white';
            drawRoundedRect(this.context, 0, 0, this.width, 36, 10);
            this.context.stroke();

            this.context.font = this.font;
            this.context.fillStyle = 'white';
            this.context.textAlign = 'left';
            this.context.fillText(`${this.text}${this.amount}`, 10, 26);
        },
        update: function () {
            this.text = `Score: ${this.score}`;
        }
    });
}

export default createTextBoard;