import { allTextSymbolsInArray } from "../../../utils";
import {calculateLettersDystribution} from "../basic";

export function findMarker(letters, textToEncode) {

    if (!allTextSymbolsInArray(textToEncode, letters))
        throw new Error("Część symboli z tekstu nie występuje w tablicy znaków");

    letters = calculateLettersDystribution(letters);
    const symbols = textToEncode.split("");

    let d = [0];
    let g = [1];
    let Fx = [0];

    letters.sort((a, b) => (a.dyst > b.dyst) ? 1 : -1);
    letters.map(x => Fx.push(x.dyst));


    for (let i = 1; i < symbols.length + 1; i++) {
        let encoding = letters.findIndex(x => x.letter == symbols[i - 1]) + 1;
        let dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding - 1];
        let gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding];

        d.push(dtmp);
        g.push(gtmp);
    }
    return (g[symbols.length] + d[symbols.length]) / 2;
}

export function decodeMarker(letters, marker, encodedWordLength) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let code = "";
    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1);
    letters.map(letter => Fx.push(letter.dyst));

    for (let i = 1; i < encodedWordLength + 1; i++) {
        let t = (marker - d[i - 1]) / (g[i - 1] - d[i - 1]);

        for (let j = 1; j < Fx.length + 1; j++) {
            if (Fx[j - 1] <= t && t < Fx[j]) {
                let dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j - 1];
                let gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j];

                d.push(dtmp);
                g.push(gtmp);
                code += letters.findIndex(x => x.dyst === Fx[j]) + 1;
                break;
            }
        }
    }
    return code;
}

