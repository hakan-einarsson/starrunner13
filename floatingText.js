import { Text } from 'kontra';

const floatingText = (text, x, y) => {
    return Text({
        text: text,
        font: '32px Arial',
        color: '#ffffffffff',
        anchor: { x: 0.5, y: 0.5 },
        x: x,
        y: y,
        dy: -1,
        ttl: 100,
        update: function () {
            this.advance();
            this.ttl--;
            this.color = `rgba(255, 255, 255, ${this.ttl / 60})`;
            if (this.ttl <= 0) {
                this.ttl = 0;
                this.dy = 0;
            }
        }
    });
}

export default floatingText;