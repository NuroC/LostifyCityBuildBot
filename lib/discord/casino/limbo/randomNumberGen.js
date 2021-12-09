function getNumber(probabilities) {
  var rnd = Math.random();
  var total = 0;
  var hit;
  for (var i = 0; i < probabilities.length; i++) {
    if (rnd > total && rnd < total + probabilities[i][0]) {
      hit = probabilities[i];
    }
    total += probabilities[i][0];
  }
  return Number((hit[1] + Math.random() * (hit[2] - hit[1])).toFixed(2));
}

module.exports = getNumber
