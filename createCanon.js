import { Sprite, Text } from 'kontra'
import { baseUnit } from './constants';

//tilesize
const ts = baseUnit;

const createCanon = (x, y, image, number, isRotated = false) => {
  return Sprite({
    x: x,
    y: y,
    image: image,
    isRotated: isRotated,
    number: number,
    isActive: false,
    isOutsideGrid: false,
    inTransition: false,
    green: '#41772f',
    red: '#ae3b2f',
    getNumber: function () {
      return this.number;
    },
    activate: function () {
      this.isActive = true;
    },
    deactivate: function () {
      this.isActive = false;
    },
    render: function () {
      if (this.isRotated) {
        if (!this.isOutsideGrid) {
          const tileColor = this.isActive ? this.red : this.green;
          this.context.fillStyle = tileColor;
          this.context.fillRect(8, 20, 13, 26);
        }
        this.context.save();
        this.context.translate(0, 0 + ts);
        this.context.rotate(-Math.PI / 2);
        this.context.drawImage(this.image, ts, 0, ts, ts, 0, 0, ts, ts);
        this.context.restore();
      } else {
        if (!this.isOutsideGrid) {
          const tileColor = this.isActive ? this.red : this.green;
          this.context.fillStyle = tileColor;
          this.context.fillRect(20, 8, 26, 13);
        }
        this.context.drawImage(this.image, ts, 0, ts, ts, 0, 0, ts, ts);
      }
    },
    update: function (dt) {
      if (this.inTransition) {
        const step = (8 / (1 - dt)) * 59 / 60; // Beräkna steglängd baserat på dt

        if (this.isRotated) {
          this.y -= step;
          if (this.y % ts <= step) { // Kolla om vi är på eller passerar en gridlinje
            this.y = Math.round(this.y / ts) * ts; // Justera till närmaste gridlinje
            this.inTransition = false;
          }
        } else {
          this.x -= step;
          if (this.x % ts <= step) { // Kolla om vi är på eller passerar en gridlinje
            this.x = Math.round(this.x / ts) * ts; // Justera till närmaste gridlinje
            this.inTransition = false;
          }
        }
      }
    }

  });
}

export default createCanon;