import {probGreaterThanOne} from "../../utils";

export function calculateLettersProb(letters) {
    let numberOfLetters = letters.reduce((sum, x) => {
        return sum + x.occures;
    }, 0);
    //Calculate probability
    for (let pair of letters) {
        pair.prob = pair.occures / numberOfLetters;
    }

    return letters.sort((a, b) => (a.letter > b.letter ? 1 : -1));
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
    if (letters.filter(x => !x.prob) > 0)
        throw new Error("Symbole nie mają obliczonej częstości");

    if (letters.length > 1)
        letters = letters.sort((a, b) => (a.letter > b.letter ? 1 : -1));
    letters[0].dyst = letters[0].prob;
    for (let i = 1; i < letters.length; i++) {
        letters[i].dyst = letters[i - 1].dyst + +letters[i].prob;
    }
    return letters;
}

export function calculateLetters(sentence, trimSentence = false) {
    if (!sentence) return;
    if (trimSentence) sentence = sentence.trim();

    return calculateLettersProb(calculateLettersFreq(sentence));
}

export function calculateEntropyForString(sentence) {
    if (!sentence) return;

    const letters = calculateLetters(sentence);
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
