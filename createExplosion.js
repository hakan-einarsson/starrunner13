import { Sprite } from 'kontra';

const createExplosion = (gameState) => {
    let particles = [];

    for (let i = 0; i < 20; i++) {
        particles.push({
            x: gameState.playerSprite.x,
            y: gameState.playerSprite.y,
            radius: Math.random() * 20 + 10,
            color: `rgba(255, ${Math.random() * 255}, 0, 1)`,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: (Math.random() - 0.5) * 4,
            life: 1.0
        });
    }

    return Sprite({
        x: gameState.playerSprite.x,
        y: gameState.playerSprite.y,
        particles: particles,
        gameState: gameState,

        update(dt) {
            const ff = dt / (1 / 60);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                let p = this.particles[i];

                p.x += p.velocityX * ff;
                p.y += p.velocityY * ff;
                p.radius *= 0.97;
                p.life -= 0.02 * ff;


                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            if (this.particles.length === 0) {
                this.ttl = 0; // "Time to live", döda spriten när partiklarna är borta
                this.gameState.gameOver = true;
            }
        },

        // Rendera explosionen
        render() {
            this.particles.forEach(p => {
                this.context.beginPath();
                this.context.arc(p.x - this.x, p.y - this.y, p.radius, 0, 2 * Math.PI, false);
                this.context.fillStyle = p.color.replace("1)", `${p.life})`); // Uppdatera opacitet
                this.context.fill();
            });
        }
    });
}

export default createExplosion;