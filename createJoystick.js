import { baseUnit } from "./constants";

const createJoystick = (ctx, x, y, scale, options = {}) => {
    return {
        ctx: ctx,
        baseX: x,
        baseY: y,
        scale: scale,
        baseRadius: options.baseRadius ?? baseUnit * 1,
        thumbX: x,
        thumbY: y,
        thumbRadius: options.thumbRadius ?? baseUnit / 2, // Tumens radie
        color: options.color ?? '#fff',
        lineColor: options.lineColor ?? '#000',
        thumbColor: options.thumbColor ?? '#fff',
        thumbLineColor: options.thumbLineColor ?? '#000',
        active: false,
        joystickVector: { x: 0, y: 0 },
        identifier: null,
        render: function () {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 5;
            this.ctx.arc(this.baseX, this.baseY, this.baseRadius * 1.25, 0, Math.PI * 2);
            this.ctx.fillStyle = this.lineColor;
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
            // Rita tummen
            this.ctx.beginPath();
            this.ctx.arc(this.thumbX, this.thumbY, this.thumbRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.thumbLineColor;
            this.ctx.lineWidth = 5;
            this.ctx.fillStyle = this.thumbColor;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.stroke();
        },
        handleStart: function (x, y) {
            const dist = Math.hypot(x - this.baseX, y - this.baseY);

            if (dist < this.baseRadius) {
                this.active = true;
                this.thumbX = x;
                this.thumbY = y;
                return true;
            }
            return false;
        },

        handleMove: function (x, y) {
            if (!this.active) return;

            const dx = x - this.baseX;
            const dy = y - this.baseY;
            const dist = Math.hypot(dx, dy);

            if (dist < this.baseRadius) {
                this.thumbX = x;
                this.thumbY = y;
            } else {
                const angle = Math.atan2(dy, dx);
                this.thumbX = this.baseX + Math.cos(angle) * this.baseRadius;
                this.thumbY = this.baseY + Math.sin(angle) * this.baseRadius;
            }

            this.joystickVector = {
                x: (this.thumbX - this.baseX) / this.baseRadius,
                y: (this.thumbY - this.baseY) / this.baseRadius,
            };
        },


        handleEnd: function () {

            this.active = false;
            this.thumbX = this.baseX;
            this.thumbY = this.baseY;
            this.joystickVector = { x: 0, y: 0 };
            this.identifier = null;
        },

        getCanvasCoordinates: function (x, y) {
            const rect = this.ctx.canvas.getBoundingClientRect();
            return {
                x: (x - rect.left) / this.scale,
                y: (y - rect.top) / this.scale,
            };
        },

        getJoystickVector: function () {
            return this.joystickVector
        }

    }
}

export default createJoystick;