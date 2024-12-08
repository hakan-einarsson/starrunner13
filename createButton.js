import { baseUnit } from './constants.js';
import { drawRoundedRect } from './drawUtils.js';

const createButton = (ctx, x, y, label, options = {}) => {
    return {
        ctx: ctx,
        centerOffset: baseUnit / 2 - label.length * 2,
        color: options.color ?? '#555',
        lineColor: options.lineColor ?? '#333',
        activeColor: options.activeColor ?? '#333',
        shape: options.shape ?? 'rect',
        radius: options.radius ?? null,
        lineWidth: options.lineWidth ?? 5,
        x: x,
        y: options.shape === 'circle' ? y - options.radius : y,
        width: options.width ?? baseUnit * 2,
        height: options.height ?? baseUnit * 1,
        fontSize: options.fontSize ?? baseUnit / 3,
        label: label,
        active: false,
        render: function () {
            if (this.shape === 'rect') {
                this.drawRect();
            }
            if (this.shape === 'circle') {
                this.drawCircle();
            }

        },
        isPressed: function (touchX, touchY) {
            if (this.shape === 'rect') {
                return (
                    touchX >= this.x &&
                    touchX <= this.x + this.width &&
                    touchY >= this.y &&
                    touchY <= this.y + this.height
                );
            }
            if (this.shape === 'circle') {
                const dx = this.x + this.radius - touchX;
                const dy = this.y + this.radius - touchY;
                return Math.sqrt(dx * dx + dy * dy) < this.radius;
            }
        },
        drawRect() {
            this.ctx.fillStyle = this.active ? this.activeColor : this.color;
            this.ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
            this.ctx.strokeStyle = this.lineColor;
            this.ctx.lineWidth = 5;
            drawRoundedRect(this.ctx, this.x, this.y, this.width, this.height, 10);
            this.ctx.stroke();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${this.fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.label, this.x + this.width / 2, this.y - 10);
        },
        drawCircle() {
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.active ? this.activeColor : this.color;
            this.ctx.fill();
            this.ctx.strokeStyle = this.lineColor;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${this.fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.label, this.x + this.radius, this.y - 12);
        }

    };
};

export default createButton;
