import { Sprite, keyPressed, gamepadPressed, gamepadAxis, } from 'kontra';
import { baseUnit } from './constants';

const createPlayer = (canvasContext, sprite) => {
    return Sprite({
        x: 5 * baseUnit - baseUnit / 2,
        y: 5 * baseUnit - baseUnit / 2,
        velocity: { x: 0, y: 0 },
        direction: { x: 0, y: -1 },
        anchor: { x: 0.5, y: 0.5 },
        speed: 2.5 * 60,
        size: baseUnit,
        rotation: 0,
        customImage: sprite,
        turbo: false,
        energy: 100,
        cooldown: 0,
        dead: false,
        stealthed: false,
        context: canvasContext,
        touchControls: null,
        paused: false,
        buttonWasPressedMap: {
            boost: false,
            stealth: false,
            start: false
        },

        addTouchControls(touchControls) {
            this.touchControls = touchControls;
        },
        toggleTurbo() {
            if (!this.stealthed) {
                this.turbo = !this.turbo;
                this.buttonWasPressedMap.boost = true;
            }
        },
        resetPlayer() {
            this.x = 5 * baseUnit - baseUnit / 2;
            this.y = 5 * baseUnit - baseUnit / 2;
            this.dead = false;
            this.energy = 100;
            this.turbo = false;
            this.rotation = 0;
        },
        updateEnergy(dt) {
            const ff = dt / (1 / 60);
            if (this.turbo) {
                this.energy -= 1 * ff;
                if (this.energy <= 0) {
                    this.turbo = false;
                }
            } else if (this.stealthed) {
                this.energy -= 1.5 * ff;
                if (this.energy <= 0) {
                    this.stealthed = false;
                }
            } else {
                this.energy += 0.5 * ff;
                if (this.energy > 100) {
                    this.energy = 100;
                }
            }
        },
        getSpeed() {
            return this.turbo ? this.speed * 2 : this.speed;
        },
        normalizeVector(vector) {
            const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 0, y: 0 };
        },
        remove() {
            this.ttl = 0;
        },
        render() {
            if (this.stealthed) {
                this.context.globalAlpha = 0.5;
            }
            this.context.drawImage(this.customImage, 128, 0, this.size, this.size, -this.size / 2, -this.size / 2, this.size, this.size);
        },
        update(dt) {
            let axisX = gamepadAxis('leftstickx', 0);
            let axisY = gamepadAxis('leftsticky', 0);
            this.direction.x = 0;
            this.direction.y = 0;

            if (keyPressed('w') || keyPressed('arrowup') || gamepadPressed('dpadup') || axisY < -0.5) {
                this.direction.y = -1;
            }

            if (keyPressed('s') || keyPressed('arrowdown') || gamepadPressed('dpaddown') || axisY > 0.5) {
                this.direction.y = 1;
            }

            if (keyPressed('a') || keyPressed('arrowleft') || gamepadPressed('dpadleft') || axisX < -0.5) {
                this.direction.x = -1;
            }

            if (keyPressed('d') || keyPressed('arrowright') || gamepadPressed('dpadright') || axisX > 0.5) {
                this.direction.x = 1;
            }

            if ((this.touchControls && this.touchControls.joystick.active)) {
                const vector = this.touchControls.getJoystickVector();
                this.direction.x = vector.x;
                this.direction.y = vector.y;
            }

            if (keyPressed('space') || gamepadPressed('south') || (this.touchControls && this.touchControls.getButtonPressed('boost'))) {
                if (!this.buttonWasPressedMap.boost) {
                    this.toggleTurbo();
                }
            } else {
                this.buttonWasPressedMap.boost = false;
            }

            if (keyPressed('ctrl') || gamepadPressed('west') || (this.touchControls && this.touchControls.getButtonPressed('stealth'))) {
                if (!this.turbo && !this.buttonWasPressedMap.stealth) {
                    this.stealthed = !this.stealthed;
                    this.buttonWasPressedMap.stealth = true;
                }
            } else {
                this.buttonWasPressedMap.stealth = false;
            }

            if (keyPressed('enter') || gamepadPressed('start') || (this.touchControls && this.touchControls.getButtonPressed('start'))) {
                if (!this.buttonWasPressedMap.start) {
                    this.paused = !this.paused;
                    this.buttonWasPressedMap.start = true;
                }
            } else {
                this.buttonWasPressedMap.start = false;
            }


            if (Math.abs(this.direction.x) === 1 && Math.abs(this.direction.y) === 1) {
                this.direction.x /= Math.sqrt(2);
                this.direction.y /= Math.sqrt(2);
            }

            this.velocity.x = this.direction.x * this.getSpeed();
            this.velocity.y = this.direction.y * this.getSpeed();


            if (this.velocity.x !== 0 && this.velocity.y !== 0) {
                const magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
                this.velocity.x /= magnitude;
                this.velocity.y /= magnitude;
            }
            if (!this.paused) {
                this.x += this.velocity.x * dt;
                this.y += this.velocity.y * dt;
            }
            if (this.x < baseUnit + this.size / 2) {
                this.x = baseUnit + this.size / 2;
            }
            if (this.x > baseUnit * 8 - this.size / 2) {
                this.x = baseUnit * 8 - this.size / 2;
            }
            if (this.y < baseUnit + this.size / 2) {
                this.y = baseUnit + this.size / 2;
            }
            if (this.y > baseUnit * 8 - this.size / 2) {
                this.y = baseUnit * 8 - this.size / 2;
            }

            if (!this.paused) {
                if (this.direction.x !== 0 || this.direction.y !== 0) {
                    this.rotation = Math.atan2(this.direction.y, this.direction.x) + Math.PI / 2;
                }
                this.updateEnergy(dt);
            }
            if (this.cooldown > 0) {
                this.cooldown -= 1;
            }
        }
    });
}

export default createPlayer;