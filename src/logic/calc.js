export function breakDownToLetters(sentence, trimSentence = true) {
  if (isEmpty(sentence)) return;

  if (trimSentence) sentence = sentence.trim();

  var letters = [];

  var occured = false;

  //Calculate occurances
  for (var char of sentence.split("")) {
    for (var obj of letters) {
      if (obj.letter === char) {
        obj.occures++;
        occured = true;
        break;
      }
    }
    if (!occured) letters.push({ letter: char, occures: 1 });

    occured = false;
  }
  //Calculate probability
  for (var pair of letters) {
    pair.prob = pair.occures / sentence.length;
  }

  return letters;
}

export function calculateEntropyForString(sentence) {
  if (isEmpty(sentence)) return;

  const letters = breakDownToLetters(sentence);
  if (!letters) return;

  return calculateEntropyForLetters(letters);
}

export function calculateEntropyForLetters(letters) {
  if (!letters) return;

  console.log("ENTROPY", letters);

  if (probGreaterThanOne(letters)) return;

  var entropy = 0;
  for (var letter of letters) {
    if (letter.prob == 0) continue;
    entropy -= letter.prob * (Math.log(letter.prob) / Math.log(2));
  }
  return entropy;
}

export function calculateHuffmanCodeForString(sentence) {
  var letters = breakDownToLetters(sentence);

  return calculateHuffmanCodeForLetters(letters);
}

export function calculateHuffmanCodeForLetters(letters) {
  if (!letters) return;

  if (letters.length == 1) {
    letters[0].code = "1";
    return letters;
  }
  console.log("Huffman encoding");
  console.log(letters);
  var fullLength = letters.length;
  for (let i = 0; i < fullLength; i++) {
    //Sort by probability descending
    letters.sort((a, b) => {
      return b.prob - a.prob;
    });

    //if i=n-2
    if (letters.length == 2) break;

    var last1 = letters[letters.length - 1];
    var last2 = letters[letters.length - 2];

    last1.code = "";
    last2.code = "";

    letters = letters.slice(0, letters.length - 2);

    letters.push({
      letter: last1.letter + last2.letter,
      prob: +last1.prob + +last2.prob,
      code: "",
      combines: [last1, last2]
    });

    console.log(letters);
  }

  console.log("ASSIGN CODE!!!!!!");

  letters[0].code = "1";
  letters[1].code = "0";
  console.log(letters);

  //Przypożądkuj słowa kodowe
  while (letters.length !== fullLength) {
    //Sort by probability descending
    letters.sort((a, b) => {
      return b.letter.length - a.letter.length;
    });

    //Get first letter
    var firstLetter = letters[0];

    //Remove it from array
    letters = letters.slice(1, letters.length);
    //Assign code value
    firstLetter.combines[0].code += firstLetter.code + "0";
    firstLetter.combines[1].code += firstLetter.code + "1";

    //Add letters to array
    letters.push(firstLetter.combines[0]);
    letters.push(firstLetter.combines[1]);

    console.log(letters);
  }

  return letters;
}

export function calculateAverageCodeLength(letters) {
  var output = 0;
  if (!letters) return;

  for (var letter of letters) {
    output += letter.prob * letter.code.length;
  }

  return output;
}

export function calculateRedundancy(letters) {
  if (!letters) return;
  var codeLength = calculateAverageCodeLength(letters);
  var entropy = calculateEntropyForLetters(letters);

  return Math.abs(entropy - codeLength);
}

export function generateRandomAsciiString(length = 100) {
  let output = "";
  for (let index = 0; index < length; index++) {
    output = output.concat(String.fromCharCode(getRndInteger(32, 127)));
  }
  return output;
}

export function generateStringWithGivenProb(letters, length) {
  let output = "";
  console.log(letters);

  letters[0].dyst = letters[0].prob;

  for (let i = 1; i < letters.length; i++) {
    letters[i].dyst = letters[i - 1].dyst + +letters[i].prob;
  }

  for (let j = 0; j < length; j++) {
    var luck = Math.random();
    let j = 0;

    while (luck > letters[j].dyst) j++;
    output += letters[j].letter;
  }

  return output;
}

function probGreaterThanOne(letters) {
  let sum = letters.reduce((prev, curr) => {
    return prev + +curr.prob;
  }, 0);
  console.log("SUMING", sum, Math.round(sum));
  if (Math.round(sum) > 1) {
    console.error("Probability greater than one");
    return true;
  }

  return false;
}

export function isEmpty(str) {
  return !str || str.length === 0;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
