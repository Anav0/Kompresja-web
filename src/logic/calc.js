import * as notify from "./notify";

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

export function generateStringWithGivenProb(letters, length = 5000000) {
  let output = "";

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
  let tables = [];
  let successorFound = false;
  let tableFound = false;

  /*{
    letter: "a",
    occures: 1
    successors: [
      {letter:"a",occures:2,prob:jakieś,dyst:jakies}
      {letter:"b",occures:3,prob:jakieś,dyst:jakies}
    ]
  }*/

  //Dla każdego słowa
  for (let word of words) {
    //Dzielimy słowo na znaki
    let letters = word.split("");
    console.log("==========");
    console.log(word);

    //Dla każdego znaku
    for (let i = 0; i < letters.length; i++) {
      //Bierzemy następujące po sobie znaki
      let letter1 = letters[i];
      let letter2 = letters[i + 1];
      // console.log("----------");
      // console.log("Znak 1", letter1);
      // console.log("Znak 2", letter2);
      //Szukamy tabeli występień pierwszego znaku
      let foundTable;
      for (let table of tables) {
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
        tables.push(foundTable);
      }
      tableFound = false;

      if (!letter2) break;

      //Sprawdzamy czy drugi znak wystąpił już w tabeli wystąpień znaku pierwszego
      for (let successor of foundTable.successors) {
        //Jeżeli wystąpił to zwiększamy liczbę jego wystąpień o 1
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
  }
  //Jak już wiemy ile razy dany znak nastąpił do innym to możemy obliczyć:

  //Prob
  //Ile znak ma następników?

  for (let letter of tables) {
    const numberOfSuccesors = letter.successors.reduce(
      (total, succesor) => total + +succesor.occures,
      0
    );

    for (let successor of letter.successors) {
      successor.prob = successor.occures / numberOfSuccesors;
    }
  }
  //Dyst
  for (let j = 0; j < tables.length; j++) {
    console.log(tables, j);

    if (tables[j].successors.length < 1) continue;

    tables[j].successors[0].dyst = tables[j].successors[0].prob;
    for (let o = 1; o < tables[j].successors.length; o++) {
      let successor = tables[j].successors[o];
      successor.dyst =
        tables[j].successors[o - 1].dyst + +tables[j].successors[o].prob;
    }
  }

  //console.log(tables);
  return tables;
}
/*
  1. Zaczynamy od liter A
  2. Losujemy kolejny znak w oparciu o tablicę następników
  3. Jeśli słowo nie ma jeszcze danej długości to losujemy kolejny znak w oparciu
     o tablicę następników tego znaku

*/
export function generateWordsForGivenModel(model, wordLength = 4) {
  let output = "";
  let generatedWords = [];

  for (let letter of model) {
    if (letter.successors.length == 0) continue;

    let pickedLetter = letter;
    do {
      pickedLetter = generateStringWithGivenProb(pickedLetter.successors, 1);

      output += pickedLetter;

      pickedLetter = model.find(x => x.letter == pickedLetter);

      if (!pickedLetter)
        return notify.showSnackbar("Nie udało się wygenerować słów", "error");
    } while (output.length < wordLength);

    console.log(output);
    generatedWords.push(output);
    output = "";
  }
  return generatedWords;
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
