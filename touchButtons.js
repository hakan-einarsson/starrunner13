import { Sprite } from 'kontra';

const createArrowButton = (x, y, rotation, action) => {
    return Sprite({
        x: x,
        y: y,
        width: 64,
        height: 64,
        rotation: rotation,
        action: action,
        render: function () {
            this.context.save();
            this.context.rotate(this.rotation);
            this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.moveTo(0, -32);
            this.context.lineTo(32, 32);
            this.context.lineTo(0, 16);
            this.context.lineTo(-32, 32);
            this.context.closePath();
            this.context.fill();
            this.context.restore();
        }
    });
}

export { createArrowButton };