import { Sprite } from 'kontra';
import { baseUnit } from './constants';

const createLazerVertical = (targetPoint) => {
    return Sprite({
        x: targetPoint.x + baseUnit * 1.5,
        y: baseUnit,
        color: '#aa4d8dff',
        size: 4,
        remove: false,
        render() {
            this.context.fillStyle = this.color;
            this.context.fillRect(-this.size / 2, 0, this.size, targetPoint.y - this.y);
        },
        update(dt) {
            this.size += this.size * dt * 50;
            if (this.size > 48) {
                this.size = 48;
                this.remove = true;
            }
        }
    });
};

const createLazerHorizontal = (targetPoint) => {
    return Sprite({
        x: baseUnit,
        y: targetPoint.y + baseUnit * 1.5,
        color: '#aa4d8dff',
        size: 4,
        remove: false,
        render() {
            this.context.fillStyle = this.color;
            this.context.fillRect(0, -this.size / 2, targetPoint.x - 32, this.size);
        },
        update(dt) {
            this.size += this.size * dt * 50;
            if (this.size > 48) {
                this.size = 48;
                this.remove = true;
            }
        }
    });
};

export { createLazerVertical, createLazerHorizontal };