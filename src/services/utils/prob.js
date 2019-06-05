export function probGreaterThanOne(letters) {
  let sum = letters.reduce((prev, curr) => {
    return prev + +curr.prob;
  }, 0);
  if (Math.round(sum) > 1) {
    console.error("Probability greater than one");
    return true;
  }

  return false;
}

