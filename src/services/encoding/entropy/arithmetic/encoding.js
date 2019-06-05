import { allTextSymbolsInArray } from "../../../utils";
import {calculateLettersDystribution} from "../basic";

export function arithmeticEncoding(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let binary = "";
    let c = false;
    let dtmp = 0;
    let gtmp = 1;

    if (!allTextSymbolsInArray(textToEncode, letters))
        throw new Error("Część symboli z tekstu nie występuje w tablicy znaków");

    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1);
    letters.map(letter => Fx.push(letter.dyst));

    const symbols = textToEncode.split("");
    for (let i = 1; i < symbols.length; i++) {
        let encoding = letters.findIndex(x => x.letter == symbols[i - 1]) + 1;

        dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding - 1];
        gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding];

        d.push(dtmp);
        g.push(gtmp);

        do {
            //[0, 0.5) A
            if (dtmp >= 0 && gtmp < 0.5) {
                binary += "0";

                //skalowanie
                dtmp = 2 * dtmp;
                gtmp = 2 * gtmp;
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);
                c = false;

                continue;
            }
            if (dtmp >= 0.5 && gtmp < 1) {
                //[0.5, 1) B
                binary += "1";

                //skalowanie
                dtmp = 2 * (dtmp - 0.5);
                gtmp = 2 * (gtmp - 0.5);
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);

                c = false;

                continue;
            }
            //[0, 1) C
            if (dtmp >= 0 && gtmp < 1) {
                c = true;
            }
        } while (!c);
    }

    if (c) {
        let number = Math.round(dtmp * 10) / 10;
        let bin = number.toString(2);
        let splited = bin.split(".");
        console.error(bin, splited);

        if (splited.length > 2)
            throw new Error("Something went terribly wrong :c");

        if (!splited || splited.length <= 1)
            binary += bin;
        else
            binary += splited[1];
    }

    return binary.toString(2);
}

export function improvedArithmeticEncoding(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let binary = "";
    let isD = false;
    let dtmp = 0;
    let gtmp = 1;
    let G = 0;
    if (!allTextSymbolsInArray(textToEncode, letters))
        throw new Error("Część symboli tekstu nie występuje w tablicy znaków");

    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1);
    letters.map(letter => Fx.push(letter.dyst));

    const symbols = textToEncode.split("");
    for (let i = 1; i < symbols.length; i++) {
        let encoding = letters.findIndex(x => x.letter == symbols[i - 1]) + 1;

        dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding - 1];
        gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding];

        d.push(dtmp);
        g.push(gtmp);

        do {
            //[0, 0.5) A
            if (dtmp >= 0 && gtmp < 0.5) {
                binary += "0";
                let numberOfAddedBits = 0;
                while (numberOfAddedBits < G) {
                    binary += "1";
                    numberOfAddedBits++;
                }
                G = 0;

                //skalowanie
                dtmp = 2 * dtmp;
                gtmp = 2 * gtmp;
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);
                isD = false;


            } else if (dtmp >= 0.5 && gtmp < 1) {
                //[0.5, 1) B
                binary += "1";
                let numberOfAddedBits = 0;
                while (numberOfAddedBits < G) {
                    binary += "0";
                    numberOfAddedBits++;
                }
                G = 0;
                //skalowanie
                dtmp = 2 * (dtmp - 0.5);
                gtmp = 2 * (gtmp - 0.5);
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);

                isD = false;


            }
            //[0, 1) C
            else if (dtmp >= 0.25 && gtmp < 0.75) {
                G++;
                dtmp = 2 * (dtmp - 0.25);
                gtmp = 2 * (gtmp - 0.25);
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);

                isD = false;



            } else {
                isD = true;
            }
        } while (!isD);
    }

    // :c
    binary += "1";
    return binary;
}

export function decodeArithmeticEncoding(letters, binary, length) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let decoded = "";

    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1);
    letters.map(letter => Fx.push(letter.dyst));

    let smallestSection = Number.MAX_VALUE;
    for (let k = 1; k < Fx.length; k++) {
        for (let o = 1; o < Fx.length; o++) {
            if (o == k) continue;

            if (Math.abs(Fx[k] - Fx[o]) < smallestSection)
                smallestSection = Math.abs(Fx[k] - Fx[o]);
        }
    }

    let k = Math.round([-Math.log2(smallestSection)] + 1);
    let firstkBits = binary.substring(0, k);
    firstkBits = firstkBits.toString();

    for (let i = 1; i < length + 1; i++) {
        let marker = ("0." + firstkBits).parseBinary();
        let t = ((marker - d[i - 1]) / (g[i - 1] - d[i - 1]));

        for (let j = 1; j < Fx.length + 1; j++) {
            if (Fx[j - 1] <= t && t < Fx[j]) {
                let dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j - 1];
                let gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j];

                d.push(dtmp);
                g.push(gtmp);

                let isC = false;
                do {

                    //[0, 0.5) A
                    if (dtmp >= 0 && gtmp < 0.5) {

                        firstkBits = firstkBits.slice(1);

                        let shiftedBinary = [...binary][k];
                        if (!shiftedBinary)
                            firstkBits += "0";
                        else
                            firstkBits += shiftedBinary;
                        k++;
                        dtmp = 2 * dtmp;
                        gtmp = 2 * gtmp;
                        d.splice(d.length - 1, 1, dtmp);
                        g.splice(g.length - 1, 1, gtmp);
                        isC = false;

                        //[0.5, 1) B
                    } else if (dtmp >= 0.5 && gtmp < 1) {

                        firstkBits = firstkBits.slice(1);
                        let shiftedBinary = [...binary][k];
                        if (!shiftedBinary)
                            firstkBits += "0";
                        else
                            firstkBits += shiftedBinary;
                        k++;
                        dtmp = 2 * (dtmp - 0.5);
                        gtmp = 2 * (gtmp - 0.5);
                        d.splice(d.length - 1, 1, dtmp);
                        g.splice(g.length - 1, 1, gtmp);

                        isC = false;

                    }
                    //[0, 1) C
                    else if (dtmp >= 0 && gtmp < 1) {
                        isC = true;
                    }
                } while (!isC);

                decoded += letters.findIndex(x => x.dyst === Fx[j]) + 1;
            }
        }
    }
    return decoded;
}