const gameOverTexts = [
    "Almost there! Keep going and beat your best score!",
    "Good try, pilot! Your high score awaits to be beaten!",
    "Not bad! But can you go further next time?",
    "You’ve got the skills. Let’s see them in action again!",
    "Keep flying, Star Runner! The galaxy is counting on you!",
    "Don’t stop now! The stars are yours for the taking!",
    "That was a solid run! Ready to try again?"
];

const newRecordTexts = [
    "Unstoppable! A new high score of [X] has been set!",
    "You did it! New best score: [X]. Keep it up!",
    "Out of this world! A stellar new high score: [X]!",
    "Uncharted territory! Your best score is now [X]!",
    "Congratulations, pilot! A record-breaking run: [X]!"
]

const getTitleText = (score, initialScore) => {
    if (score > initialScore) {
        return newRecordTexts[Math.floor(Math.random() * newRecordTexts.length)].replace('[X]', score).replace('[Y]', initialScore);
    } else {
        return gameOverTexts[Math.floor(Math.random() * gameOverTexts.length)].replace('[X]', score).replace('[Y]', initialScore);
    }
}

export default getTitleText;