import { Sprite } from 'kontra';
import { baseUnit } from './constants';

const createGoalSprite = (canvasContext) => {
    return Sprite({
        x: Math.floor(Math.random() * 7) * baseUnit + baseUnit,
        y: Math.floor(Math.random() * 7) * baseUnit + baseUnit,
        radius: 32,
        color: '#edc06d',
        context: canvasContext,
        render() {
            this.context.fillStyle = '#00000055';
            this.context.beginPath();
            this.context.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
            this.context.fill();
            const gradient = this.context.createRadialGradient(this.radius / 1.3, this.radius / 1.3, 0, 0, 0, this.radius * 2);
            gradient.addColorStop(0, '#edc06dff');
            gradient.addColorStop(1, '#edc06d00');
            this.context.fillStyle = gradient;
            this.context.beginPath();
            this.context.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
            this.context.fill();
        }
    });
}

export default createGoalSprite;