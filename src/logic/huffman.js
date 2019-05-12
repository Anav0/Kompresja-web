import * as calc from "./calc";

export function calculateHuffmanCodeForString(sentence) {
    var letters = calc.calculateLettersProbAndFreq(sentence);

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
    console.log(letters)
    return letters;
}