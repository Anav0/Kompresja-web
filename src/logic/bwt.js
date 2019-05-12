const text = "banananananananananananan";

function cycleShift(text) {
  let letters = [...text];
  let output = [text];
  for (let i = 1; i < text.length; i++) {
    letters.push(letters.shift());
    output.push(letters.join(""));
  }
  return output;
}

function getLastLetters(shifted) {
  return shifted.reduce((lastLetters, x) => {
    return (lastLetters += x.slice(-1));
  }, "");
}

function bwt(O) {
  let code = {};
  let output = "";
  let P = O.split("").sort();
  O = O.split("");

  for (let letter of O) {
    let index = code[letter];
    if (!index)
      index = P.indexOf(letter);
    else
      index = P.indexOf(letter, index + 1);

    code[letter] = index;
    output += index;
  }
  return output;
}

function mtf(O) {
  let symbols = [...new Set(O.split(""))];
  let output = "";
  O = O.split("");

  for (let symbol of O) {
    let code = symbols.indexOf(symbol);
    output += code;
    symbols.unshift(...symbols.splice(code, 1))
    console.log(symbols);
  }
  let prevChar = output[0];
  for (let k = 1; k < output.length; k++) {
    if (output[k] == prevChar)
      output[k] = "0";
    prevChar = output[k];
  }
  return output;
}


let shiftedText = cycleShift(text).sort();
console.log(shiftedText)

let I = shiftedText.indexOf(text);
console.log("I", I);

let O = getLastLetters(shiftedText);
console.log("O", O);

let T = bwt(O, I);
console.log("T", T);


console.log("mtf", mtf(O, I));