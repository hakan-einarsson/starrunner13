// Function to save score to local storage
const saveScore = (score) => {
    localStorage.setItem('gameScore', score);
}

const getScore = () => {
    return localStorage.getItem('gameScore') || 0;
}

// Example usage

export { saveScore, getScore };
