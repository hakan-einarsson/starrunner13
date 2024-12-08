import { Sprite } from 'kontra';

const createBackground = (backgroundImage) => {
    return Sprite({
        x: 0,
        y: 0,
        image: backgroundImage,
    });
}

export default createBackground;