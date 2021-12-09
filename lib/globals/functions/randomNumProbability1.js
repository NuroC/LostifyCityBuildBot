function randomNumProbability1(min,max) {
    return min-1+Math.pow((max-min+1),Math.random());
}
module.exports = randomNumProbability1;