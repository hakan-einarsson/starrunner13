import { Sprite } from 'kontra';
import { baseUnit } from './constants';

const createWarningTile = (tile) => {
    return Sprite({
        x: tile.x * baseUnit + baseUnit,
        y: tile.y * baseUnit + baseUnit,
        color: '#ae3b2f',
        alpha: 255,
        width: baseUnit,
        height: baseUnit,
        render: function () {
            const color = `${this.color}${this.alpha.toString(16).padStart(2, '0')}`;
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.width, this.height);
        },
        update: function (dt) {
            this.alpha = this.alpha - Math.floor(dt * 200);
            if (this.alpha < 0) {
                this.alpha = 0;
            }
        }
    });
}

export default createWarningTile;

