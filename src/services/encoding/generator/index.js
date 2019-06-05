import {calculateLettersDystribution, calculateLettersProb} from "../entropy";
import {getRndInteger} from "../../utils";

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

export function calculateSuccessors(word, prevModel, context = 1) {
    if (!word || word.trim() === "") return prevModel;
    let letters = word.split("");

    switch (context) {
        default:
        case 1:
            prevModel = getSuccessorsContext1(letters, prevModel);
            break;
    }

    return prevModel;
}

export function getSuccessorsContext1(letters, prevModel) {
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
            letter.successors = calculateLettersDystribution(
                calculateLettersProb(letter.successors)
            );
    }

    return model;
}

export function generateWordsForGivenModel(
    model,
    wordLength = 4,
    numberOfWords = 1000,
    variant = "B"
) {
    switch (variant) {
        case "B":
            return generateWordsFromModelVariantB(numberOfWords, wordLength, model);
        case "C":
            return generateWordsFromModelVariantC(numberOfWords, wordLength, model);
        default:
            return [];
    }
}

export function generateWordsFromModelVariantB(numberOfWords, wordLength, model) {
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

export function generateWordsFromModelVariantC(
    numberOfWords = 100,
    wordLength = 4,
    model
) {
    if (!model) throw new Error("model argument is null");

    console.log(model);
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

export function generateRandomAsciiString(length = 100) {
    let output = "";
    for (let index = 0; index < length; index++) {
        output = output.concat(String.fromCharCode(getRndInteger(32, 127)));
    }
    return output;
}