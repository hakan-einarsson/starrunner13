import { Sprite } from 'kontra';
import { baseUnit } from './constants';

const createEnergyBar = () => {
    return Sprite({
        x: baseUnit * 7,
        y: baseUnit * 8 + 32,
        width: 96,
        height: 32,
        customRender(energy) {
            this.context.fillStyle = 'white';
            this.context.fillRect(this.x - 32, this.y - this.height / 2, this.width + 36, this.height + 4);
            this.context.fillStyle = 'black';
            this.context.fillRect(this.x + 2, this.y - this.height / 2 + 2, this.width, this.height);
            this.context.fillStyle = '#4a8cbd';
            this.context.fillRect(this.x + 2, this.y - this.height / 2 + 2, this.width * energy / 100, this.height);
            this.context.fillStyle = 'black';
            this.context.font = 'bold 20px Arial';
            this.context.fillText('E', this.x - 22, this.y + 10);
        }
    });
}

export default createEnergyBar;
