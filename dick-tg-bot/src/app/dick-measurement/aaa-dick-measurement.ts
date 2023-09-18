const MIN = 1
const MAX = 40;
const SPREAD = 5;

export function getRandomIntInRange(): number {
  if (MIN >= MAX) {
    throw new Error('The minimum value must be less than the maximum value.');
  }

  const range = MAX - MIN + 1;
  const mean = MIN + range / 2 - 0.5;
  const stdDev = range / SPREAD;

  let num = Math.round(mean + stdDev * randBellCurve());

  // Ensure number falls within the provided range
  return Math.min(Math.max(num, MIN), MAX);
}

// Generates a random number based on standard normal distribution
function randBellCurve(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// // Test the function
// const [ MIN, MAX ] = [ 1, 40 ];
// let count = new Array(MAX + 1).fill(0); // Array to store occurrences of each number
//
// // Generate a large number of samples to see the distribution
// for (let i = 0; i < 100000; i++) {
//   let num = getRandomIntInRange(MIN, MAX, 5);
//   count[num]++;
// }
//
// // Display the distribution
// console.log(`SPREAD: 7`, count.slice(MIN).map((v) => (v / 1000).toFixed(1) + '%'));
