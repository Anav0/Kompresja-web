
export function calculateLettersProb(letters) {

  let numberOfLetters = letters.reduce((sum, x) => {
    return sum + x.occures;
  }, 0)
  console.log(numberOfLetters)
  //Calculate probability
  for (var pair of letters) {
    pair.prob = pair.occures / numberOfLetters;
  }

  return letters.sort((a, b) => a.prob - b.prob);
}

export function calculateLettersFreq(sentence) {
  let letters = [];
  let occured = false;

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
  return letters;
}

export function calculateLettersDystribution(letters) {
  if (letters.length > 1)
    letters = letters.sort((a, b) => b.prob - a.prob);
  letters[0].dyst = letters[0].prob;
  for (let i = 1; i < letters.length; i++) {
    letters[i].dyst = letters[i - 1].dyst + +letters[i].prob;
  }
  return letters;
}

export function calculateLettersProbAndFreq(sentence, trimSentence = true) {
  if (isEmpty(sentence)) return;
  if (trimSentence) sentence = sentence.trim();

  return calculateLettersProb(calculateLettersFreq(sentence));
}

export function calculateEntropyForString(sentence) {
  if (isEmpty(sentence)) return;

  const letters = calculateLettersProbAndFreq(sentence);
  if (!letters) return;

  return calculateEntropyForLetters(letters);
}

export function calculateEntropyForLetters(letters) {
  if (!letters) return;

  if (probGreaterThanOne(letters)) return;

  var entropy = 0;
  for (var letter of letters) {
    if (letter.prob == 0) continue;
    entropy -= letter.prob * (Math.log(letter.prob) / Math.log(2));
  }
  return entropy;
}

export function calculateHuffmanCodeForString(sentence) {
  var letters = calculateLettersProbAndFreq(sentence);

  return calculateHuffmanCodeForLetters(letters);
}
export function calculateHuffmanCodeForLetters(letters) {
  let fullLength = letters.length;
  letters = calculateHuffmanTreeFromLetters(letters);

  //Przypisz słowa kodowe
  while (letters.length !== fullLength) {
    letters.sort((a, b) => {
      return b.letter.length - a.letter.length;
    });

    //Get first letter
    var firstLetter = letters[0];

    //Remove it from array
    letters = letters.slice(1, letters.length);
    //Assign code value
    firstLetter.combines[0].code += firstLetter.code + "1";
    firstLetter.combines[1].code += firstLetter.code + "0";

    //Add letters to array
    letters.push(firstLetter.combines[0]);
    letters.push(firstLetter.combines[1]);
  }

  return letters;
}

export function calculateHuffmanTreeFromLetters(letters) {
  if (letters.length == 1) {
    letters[0].code = "1";
    return letters;
  }
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
      occures: last1.occures + +last2.occures,
      combines: [last1, last2]
    });
  }

  letters[0].code = "1";
  letters[1].code = "0";
  return letters;
}

export function encodeTextUsingHuffmanTree(text, tree) {
  let letters = text.split("");
  let code = "";
  if (tree.length == 2)
    tree = {
      letter: tree[0].letter + tree[1].letter,
      occures: tree[0].occures + tree[1].occures,
      prob: tree[0].prob + tree[1].prob,
      combines: [tree[0], tree[1]]
    };

  for (let letter of letters) {
    code += treverseTree("", letter, tree);
  }
  return code;
}

function treverseTree(code, letter, tree) {
  //co jak nie ma lewgo liścia??? ty kurwo!
  console.log(code, letter, tree);

  if (!tree.combines) tree.combines = [];
  //Go to left leaf
  if (tree.combines[0]) {
    code += "0";
    treverseTree(code, letter, tree.combines[0]);
  }
  //Go to right leaf
  if (tree.combines[1]) {
    code += "1";
    treverseTree(code, letter, tree.combines[1]);
  }

  //If node don't have childeren check if letter matches
  if (tree.letter == letter) {
    return code;
  }

  return code;
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

export function generateStringWithGivenProb(letters, length = 5000000) {
  let output = "";

  letters = calculateLettersDystribution(letters);

  for (let j = 0; j < length; j++) {
    var luck = Math.random();
    let j = 0;

    while (luck > letters[j].dyst) j++;
    output += letters[j].letter;
  }

  return output;
}

/*
1. dzielimy plik na słowa:
Adaś
Jacek
Basia
      itd...

2. Dzielimy słowa na litery
A d a ś
J a c e k
B a s i a

3. Sprawdzamy ile razy dana litera wystąpiła po innej
tj. dla każdej litery tworzymy tablicę np.
Dla a:
a 2
b 3
c 1
d 5
...
Rozumiemy ją tak: po literze a a następiło 2 razy, b trzy razy c, trzy razy etc.

4. Liczymy prawdopodobieństwo wystąpienia oraz dystrybuantę ale tylko dla danej litery
UWAGA: prawdopodobieństwo wystąpienia np.
litery "b" po "a" dzielimy przez liczbę wystąpień litery "a" a nie wszystkich razem wziętych
zakładając że a wystąpiło 5 razy byłoby to 3/5 itd. itp.
*/
export function generateProbModelForGivenWords(words) {
  let model = [];

  //Dla każdego słowa
  for (let word of words) {
    model = calculateSuccessors(word, model);
  }

  model = calculateLettersProb(model);
  model = calculateLettersDystribution(model);

  for (let letter of model) {
    if (letter.successors && letter.successors.length > 0)
      letter.successors = calculateLettersDystribution(calculateLettersProb(letter.successors));
  }

  return model;
}

function calculateSuccessors(word, prevModel, context = 1) {

  if (!word || word.trim() === "") return prevModel;
  let letters = word.split("");

  switch (context) {
    default:
    case 1:
      prevModel = getSuccessorsContext1(letters, prevModel);
      break;
    case 2:
      prevModel = getSuccessorsContext2(letters, prevModel);
      break;
  }

  return prevModel;
}
function getSuccessorsContext1(letters, prevModel) {
  let successorFound = false;
  let tableFound = false;
  //Dla każdego znaku
  for (let i = 0; i < letters.length; i++) {
    //Bierzemy następujące po sobie znaki
    let letter1 = letters[i];
    let letter2 = letters[i + 1];

    //Szukamy tabeli występień pierwszego znaku
    let foundTable;
    for (let table of prevModel) {
      //Jeśli ją mamy to:
      if (table.letter == letter1) {
        tableFound = true;
        //Zwiększamy ilość wystąpień tego znaku
        table.occures++;
        foundTable = table;
        break;
      }
    }

    //jeśli jej nie mamy to ją dodajemy
    if (!tableFound) {
      foundTable = {
        letter: letter1,
        occures: 1,
        successors: []
      };
      prevModel.push(foundTable);
    }
    tableFound = false;

    if (!letter2) break;

    //Sprawdzamy czy drugi znak wystąpił już w tabeli następników znaku pierwszego
    for (let successor of foundTable.successors) {
      //Jeżeli tak zwiększamy liczbę jego wystąpień o 1
      if (successor.letter == letter2) {
        successorFound = true;
        successor.occures++;
        break;
      }
    }
    //Jeśli drugi znak nie wystąpił to go dodajemy
    if (!successorFound)
      foundTable.successors.push({
        letter: letter2,
        occures: 1,
        prob: 0,
        dyst: 0
      });
    successorFound = false;
  }
  return prevModel;
}

function getSuccessorsContext2(letters, prevModel) {

}

export function generateWordsForGivenModel(
  model,
  wordLength = 4,
  numberOfWords = 1000,
  variant = "B",
) {

  switch (variant) {
    case "B":
      return generateWordsFromModelVariantB(numberOfWords, wordLength, model)
    case "C":
      return generateWordsFromModelVariantC(numberOfWords, wordLength, model)
    default:
      return [];
  }

}
function generateWordsFromModelVariantB(numberOfWords, wordLength, model) {
  let generatedWords = [];
  let word = "";

  for (let j = 0; j < numberOfWords; j++) {

    for (let j = 0; j < wordLength; j++) {
      let luck = Math.random();
      let j = 0;

      while (luck > model[j].dyst) j++;
      word += model[j].letter;
    }
    generatedWords.push(word);
    word = "";
  }
  return generatedWords;

}

function generateWordsFromModelVariantC(numberOfWords, wordLength, model) {
  let output = "";
  let letterToAdd;
  let generatedWords = [];

  for (let k = 0; k < numberOfWords; k++) {
    //Losujemy 1 znak w oparciu o model probabilistyczny wszystkich znaków
    let luck = Math.random();
    let o = 0;
    while (luck > model[o].dyst) o++;
    letterToAdd = model[o];
    output += letterToAdd.letter;

    //Kolejny znak losujemy w oparciu o model probabilistyczny
    //następników
    while (output.length < wordLength) {
      let luck = Math.random();
      let j = 0;

      while (luck > letterToAdd.successors[j].dyst) j++;
      output += letterToAdd.successors[j].letter;

      letterToAdd = model.find(
        x => x.letter == letterToAdd.successors[j].letter
      );
    }
    generatedWords.push(output);
    output = "";
  }
  return generatedWords;
}

function generateWordsFromModelVariantD(numberOfWords, wordLength, model) {
  let output = "";
  let letterToAdd;
  let generatedWords = [];
}

function probGreaterThanOne(letters) {
  let sum = letters.reduce((prev, curr) => {
    return prev + +curr.prob;
  }, 0);
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
