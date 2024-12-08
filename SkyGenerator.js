let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 64 * 9;
offscreenCanvas.height = 64 * 9;
let ctx = offscreenCanvas.getContext('2d');


ctx.fillStyle = 'black';
ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

function drawStar(x, y, radius, opacity) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Vit färg med varierande opacitet
    ctx.fill();
}

export default function generateStars(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * offscreenCanvas.width;  // Slumpmässig x-position
        const y = Math.random() * offscreenCanvas.height; // Slumpmässig y-position
        const radius = Math.random() * 2;                 // Slumpmässig radie (storlek på stjärnan)
        const opacity = Math.random();                    // Slumpmässig opacitet
        drawStar(x, y, radius, opacity);
    }

    return offscreenCanvas;
}

