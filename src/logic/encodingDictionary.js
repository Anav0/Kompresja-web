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
        let encoded = "";

        if (!text)
            throw new Error("Nieprawidłowy argument funkcji");

        let letters = text.split("");

        for (let i = 1; i < letters.length; i++) {
            let firstLetter = letters[i - 1];
            let secondLetter = letters[i];
            let pair = firstLetter + secondLetter;
            console.log(pair);

            let existingPairIndex = this.dictionary.findIndex(x => x == pair);
            if (existingPairIndex != -1) {
                encoded += existingPairIndex.toString(2);
                console.log(`Dodano: ${existingPairIndex.toString(2)} dla ${pair}`);

                i++; //aby przeskoczyć do następnej pary
            }
            else {
                let tmp = this.dictionary.findIndex(x => x == firstLetter).toString(2)
                encoded += this.dictionary.findIndex(x => x == firstLetter).toString(2);
                console.log(`Dodano: ${tmp} dla ${firstLetter}`);

                if (i + 1 == letters.length) {
                    tmp = this.dictionary.findIndex(x => x == secondLetter).toString(2)
                    encoded += this.dictionary.findIndex(x => x == secondLetter).toString(2);
                    console.log(`Dodano: ${tmp} dla ${secondLetter}`);
                }
            }
        }

        console.log(encoded);
        return encoded;

    }

}

function getPairs(text) {

    if (!text || text.length < 2)
        throw new Error("Nieprawidłowy argument funkcji")

    let letters = text.split("");
    let pairs = [];

    for (let i = 1; i < letters.length; i++) {
        let pair = letters[i - 1] + letters[i];

        let existingPair = pairs.find(x => x.letter == pair);
        if (!existingPair)
            pairs.push({ letter: pair, occures: 1 });
        else
            existingPair.occures++;
    }

    return pairs.sort((a, b) => a.occures < b.occures ? 1 : -1);
}

function createDictionary(text, dictionarySize = 254) {
    if (!text || !dictionarySize || dictionarySize == 0)
        throw new Error("Nieprawidłowy argument funkcji");

    let letters = calculateLetters(text);
    let dictionary = [...new Set(letters.map(x => x.letter))].sort();

    if (dictionary.length > dictionarySize)
        throw new Error("Ilość unikalnych symboli przekracza rozmiar słownika co uniemożliwia jego utworzenie");

    if (text.length < 2)
        return dictionary;

    let pairs = getPairs(text);

    for (let pair of pairs) {
        if (dictionary.length < dictionarySize)
            dictionary.push(pair.letter)
        else
            break;
    }

    return dictionary;
}