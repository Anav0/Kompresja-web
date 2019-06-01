import { calculateLetters } from "./calc";

export default class EncodingDictionary {
  constructor(source, dictionarySize = 254) {
    this.dictionarySize = dictionarySize;
    this.source = source;
    this.dictionary = createDictionary(source, dictionarySize);
  }

  // get dictionarySize() { return this.dictionarySize; }
  // get source() { return this.source; }
  // get dictionary() { return this.dictionary; }

  encode(text) {
    if (!text) throw new Error("Nieprawidłowy argument funkcji");

    let letters = text.split("");
    let encoded = "";

    for (let i = 0; i < letters.length; i++) {
      let firstLetter = letters[i];
      let secondLetter = letters[i + 1];
      let pair = firstLetter + secondLetter;

      let existingPairIndex = this.dictionary.findIndex(x => x == pair);
      if (existingPairIndex != -1) {
        let bitsToAdd = addBits(existingPairIndex.toString(2));
        encoded += bitsToAdd;
        console.log(`Dodano: ${bitsToAdd} dla ${pair}`);

        i++; //aby przeskoczyć do następnej pary
      } else {
        let index = this.dictionary
          .findIndex(x => x == firstLetter)
          .toString(2);

        if (index == -1)
          throw new Error(`Nie znaleziono ${firstLetter} w słowniku`);

        let bitsToAdd = addBits(index);

        encoded += bitsToAdd;
        console.log(`Dodano: ${bitsToAdd} dla ${firstLetter}`);
      }
    }

    console.log(encoded);
    return encoded;
  }

  decode(encoded, groupSize = 8) {
    console.log(this.getReadableDictionary());
    if (!encoded) throw new Error("Arugment cannot be null");

    if (encoded.length % groupSize != 0)
      throw new Error(
        `Zakodowany słownikowo ciąg nie może zostać podzielony na ${groupSize} części`
      );

    let splited = encoded.split("");

    let group = "";
    let decoded = "";

    for (let i = 0; i < splited.length; i++) {
      if (group.length < groupSize) {
        group += splited[i];
      }

      if (group.length == groupSize) {
        let letter = this.dictionary.find(
          (x, index) => addBits(index.toString(2)) == group
        );

        if (!letter)
          throw new Error(`Podciąg ${group} nie występuje w słowniku`);

        decoded += letter;
        group = "";
      }
    }

    return decoded;
  }

  getReadableDictionary() {
    let rep = this.dictionary
      .reduce((output, x, index) => {
        if (x == " ") x = "spacja";
        return output + `${x} \t ${addBits(index.toString(2))}|`;
      }, "")
      .split("|");

    return rep.filter(x => x && x != "");
  }
}

function addBits(bits, finalSize = 8) {
  if (!bits || !finalSize) throw new Error("Argument cannot be null");

  while (bits.length < finalSize) bits = "0" + bits;

  return bits;
}

function getPairs(text) {
  if (!text || text.length < 2)
    throw new Error("Nieprawidłowy argument funkcji");

  let letters = text.split("");
  let pairs = [];

  for (let i = 1; i < letters.length; i++) {
    let pair = letters[i - 1] + letters[i];

    let existingPair = pairs.find(x => x.letter == pair);
    if (!existingPair) pairs.push({ letter: pair, occures: 1 });
    else existingPair.occures++;
  }

  return pairs.sort((a, b) => (a.occures < b.occures ? 1 : -1));
}

function createDictionary(text, dictionarySize = 254) {
  if (!text || !dictionarySize || dictionarySize == 0)
    throw new Error("Nieprawidłowy argument funkcji");

  let letters = calculateLetters(text);
  let dictionary = [...new Set(letters.map(x => x.letter))].sort();

  if (dictionary.length > dictionarySize)
    throw new Error(
      "Ilość unikalnych symboli przekracza rozmiar słownika co uniemożliwia jego utworzenie"
    );

  if (text.length < 2) return dictionary;

  let pairs = getPairs(text);

  for (let pair of pairs) {
    if (dictionary.length < dictionarySize) dictionary.push(pair.letter);
    else break;
  }

  return dictionary;
}
