import { GameObjectClass, Text } from "kontra";
import createJoystick from "./createJoystick";
import createButton from "./createButton";
import { baseUnit } from "./constants";

const buttonOptions = {
    shape: 'circle',
    radius: baseUnit * 1.5,
    color: 'red',
    lineColor: '#922',
    activeColor: '#922',
    lineWidth: 10
};


class TouchControls extends GameObjectClass {
    constructor(context, scale, properties) {
        super(properties);
        this.scale = scale;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.fire = false;
        this.ctx = context;
        this.startButton = createButton(context, canvas.width - baseUnit * 3, baseUnit * 14.5, 'START', { 'height': 40 });
        this.boostButton = createButton(context, canvas.width - baseUnit * 3.5, baseUnit * 11.5, 'BOOST', buttonOptions);
        this.stealthButton = createButton(context, baseUnit * 2.5, baseUnit * 13.5, 'STEALTH', buttonOptions);
        this.joystick = createJoystick(context, baseUnit * 1.5, baseUnit * 9 + baseUnit * 2, this.scale);
    }

    getJoystickVector() {
        return this.joystick.getJoystickVector();
    }

    getButtonPressed(button) {
        if (button === 'boost') {
            return this.boostButton.active;
        }
        if (button === 'stealth') {
            return this.stealthButton.active;
        }
        if (button === 'start') {
            return this.startButton.active;
        }
    }

    createDebugText(i, text) {
        return Text({
            text: text,
            font: '32px Arial',
            color: 'white',
            x: 64 * (i + 0.5),
            y: 64 * 15,
            anchor: { x: 0.5, y: 0.5 },
        });
    }

    addListeners() {
        canvas.addEventListener('touchstart', this.touchStart.bind(this), false);
        canvas.addEventListener('touchmove', this.touchMove.bind(this), false);
        canvas.addEventListener('touchend', this.touchEnd.bind(this), false);

        canvas.addEventListener('mousedown', this.touchStart.bind(this), false);
        canvas.addEventListener('mousemove', this.touchMove.bind(this), false);
        canvas.addEventListener('mouseup', this.touchEnd.bind(this), false);
    }

    getCanvasCoordinates(x, y) {
        const rect = this.ctx.canvas.getBoundingClientRect();
        return {
            x: (x - rect.left) / this.scale,
            y: (y - rect.top) / this.scale,
        };
    }

    touchStart(e) {
        e.preventDefault();
        const touches = e.touches;

        for (let i = 0; i < touches.length; i++) {
            const { x, y } = this.getCanvasCoordinates(touches[i].clientX, touches[i].clientY);
            if (this.joystick.handleStart(x, y)) {
                if (this.joystick.identifier === undefined || this.joystick.identifier === null) {
                    this.joystick.identifier = touches[i].identifier;
                    this.joystick.active = true;
                    continue;
                }
            }
            if (this.startButton.isPressed(x, y)) {
                this.startButton.active = true;
                if (this.startButton.identifier === undefined || this.startButton.identifier === null) {
                    this.startButton.identifier = touches[i].identifier;
                }
                continue;
            }

            if (this.boostButton.isPressed(x, y)) {
                this.boostButton.active = true;
                if (this.boostButton.identifier === undefined || this.boostButton.identifier === null) {
                    this.boostButton.identifier = touches[i].identifier;
                }
                continue;
            }
            if (this.stealthButton.isPressed(x, y)) {
                this.stealthButton.active = true;
                if (this.stealthButton.identifier === undefined || this.stealthButton.identifier === null) {
                    this.stealthButton.identifier = touches[i].identifier;
                }
                continue;
            }


        }
    }

    touchMove(e) {
        e.preventDefault();
        const touches = e.touches;

        for (let i = 0; i < touches.length; i++) {
            const { x, y } = this.getCanvasCoordinates(touches[i].clientX, touches[i].clientY);
            if (this.joystick.active && touches[i].identifier === this.joystick.identifier) {
                this.joystick.handleMove(x, y);
            }
        }
    }

    touchEnd(e) {
        e.preventDefault();
        const touches = e.changedTouches;
        Object.entries(touches).forEach(([key, value]) => {
            if (value.identifier === this.joystick.identifier) {
                this.joystick.handleEnd();
            }
            if (value.identifier === this.startButton.identifier) {
                this.startButton.active = false;
                this.startButton.identifier = null;
            }
            if (value.identifier === this.boostButton.identifier) {
                this.boostButton.active = false;
                this.boostButton.identifier = null;
            }
            if (value.identifier === this.stealthButton.identifier) {
                this.stealthButton.active = false;
                this.stealthButton.identifier = null;
            }
        });

    }

    update() {

    }

    render() {
        this.joystick.render();
        this.startButton.render();
        this.boostButton.render();
        this.stealthButton.render();
    }

}

export default TouchControls;