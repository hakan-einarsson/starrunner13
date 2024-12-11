const saveScore = (score) => {
    localStorage.setItem('gameScore', score);
}

const getScore = () => {
    return localStorage.getItem('gameScore') || 0;
}

const saveTopLevel = (level) => {
    localStorage.setItem('topLevel', level);
}

const getTopLevel = () => {
    return localStorage.getItem('topLevel') || 0;
}

export { saveScore, getScore, saveTopLevel, getTopLevel };
