import { Sprite } from 'kontra';
import { baseUnit } from './constants';

const createGrid = (image, currentLevel) => {
    return Sprite({
        x: 0,
        y: 0,
        image: image,
        tileSize: baseUnit,
        numRows: 8,
        green: '#41772f',
        red: '#ae3b2f',
        seed: 7,
        colorAdjust: 0,
        isUpdating: false,
        currentLevel: currentLevel,
        seededRandom: function (seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        },
        updateCurrentLevel: function (level) {
            this.currentLevel = level;
        },
        generateColor: function (seed, level) {
            let r, g, b, hex;

            do {
                r = Math.floor(this.seededRandom(seed + level + this.colorAdjust) * 256);
                g = Math.floor(this.seededRandom(seed + level + 1 + this.colorAdjust) * 256);
                b = Math.floor(this.seededRandom(seed + level + 2 + this.colorAdjust) * 256);

                // Kontrollera om färgen är rödaktig
                if (r > g + b) {
                    this.colorAdjust++;
                } else {
                    break;
                }
            } while (true);

            hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
            return `${hex}99`;
        },
        render: function () {
            for (let row = 0; row < this.numRows; row++) {
                for (let col = 0; col < this.numRows; col++) {
                    const x = col * this.tileSize;
                    const y = row * this.tileSize;

                    const colorIndex = (row + col) % 2;
                    if (colorIndex == 0 && row != 0 && col != 0) {
                        const tileColor = this.generateColor(this.seed, this.currentLevel);
                        this.context.fillStyle = tileColor;
                        this.context.fillRect(x, y, this.tileSize, this.tileSize);
                        this.context.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, x, y, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    });
}

export default createGrid;