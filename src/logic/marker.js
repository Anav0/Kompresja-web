import { calculateLettersDystribution } from "./calc";

// eslint-disable-next-line no-extend-native
String.prototype.parseBinary = function parseBinary() {
    var radix = 2;
    var s = this.split(".");
    var decimal = parseInt(s[0], radix);

    if (s.length > 1) {
        var fract = s[1].split("");

        for (var i = 0, div = radix; i < fract.length; i++ , div = div * radix) {
            decimal = decimal + fract[i] / div;
        }
    }
    return decimal;
};

function allTextSymbolsInArray(text, array) {
    if (!text || !array || array.length <= 0)
        throw new Error("Invalid arguments");

    const symbols = text.split("");
    const uniqueSymbols = [...new Set(symbols)];
    const uniqueLetters = [...new Set(array.map(x => x.letter))];

    const diff = uniqueLetters
        .filter(x => !uniqueSymbols.includes(x))
        .concat(uniqueSymbols.filter(x => !uniqueLetters.includes(x)))

    if (diff.length != 0) return false;

    return true;
}

export function findMarker(letters, textToEncode) {
    if (!allTextSymbolsInArray(textToEncode, letters))
        throw new Error("Część symboli z tekstu nie występuje w tablicy znaków")

    letters = calculateLettersDystribution(letters);
    const symbols = textToEncode.split("");

    let d = [0];
    let g = [1];
    let Fx = [0];

    letters.sort((a, b) => (a.dyst > b.dyst) ? 1 : -1)
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
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1)
    letters.map(letter => Fx.push(letter.dyst))

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

export function arithmeticBinaryCode(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let binary = "";
    let c = false;
    let dtmp = 0;
    let gtmp = 1;


    if (!allTextSymbolsInArray(textToEncode, letters))
        throw new Error("Część symboli z tekstu nie występuje w tablicy znaków")

    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1)
    letters.map(letter => Fx.push(letter.dyst))

    const symbols = textToEncode.split("");
    for (let i = 1; i < symbols.length + 1; i++) {
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

                printScaled(i, dtmp, gtmp)
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

                printScaled(i, dtmp, gtmp)
                continue;
            }
            //[0, 1) C
            if (dtmp >= 0 && gtmp < 1) {
                c = true;
            }
        } while (!c);
    }

    // :c
    binary += "1";
    return binary;
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
        throw new Error("Część symboli tekstu nie występuje w tablicy znaków")

    letters = calculateLettersDystribution(letters);
    letters.sort((a, b) => (a.letter > b.letter) ? 1 : -1)
    letters.map(letter => Fx.push(letter.dyst))

    const symbols = textToEncode.split("");
    for (let i = 1; i < symbols.length + 1; i++) {
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

                printScaled(i, dtmp, gtmp)
                continue;
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

                printScaled(i, dtmp, gtmp)
                continue;
            }
            //[0, 1) C
            else if (dtmp >= 0.25 && gtmp < 0.75) {
                G++;
                dtmp = 2 * (dtmp - 0.25);
                gtmp = 2 * (gtmp - 0.25);
                d.splice(d.length - 1, 1, dtmp);
                g.splice(g.length - 1, 1, gtmp);

                isD = false;


                continue;
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
                {
                    console.log();
                    console.log(`k = ${i}   marker = ${decoded}`);
                    console.log(`binary = ${firstkBits}`);
                    console.log(
                        `t = (${marker} - ${d[i - 1]}) / (${g[i - 1]} - ${d[i - 1]}) = ${t}`
                    );
                    console.log(`${Fx[j - 1]} <= ${t} < ${Fx[j]}`);
                    console.log(
                        `d${i} = ${d[i - 1]} + (${g[i - 1]} - ${d[i - 1]}) * ${
                        Fx[j - 1]
                        } = ${dtmp}`
                    );
                    console.log(
                        `g${i} = ${d[i - 1]} + (${g[i - 1]} - ${d[i - 1]}) * ${
                        Fx[j]
                        } = ${gtmp}`
                    );
                }
                let isC = false;
                do {
                    console.log();

                    //[0, 0.5) A
                    if (dtmp >= 0 && gtmp < 0.5) {

                        console.log("FIRST BITS", firstkBits)
                        firstkBits = firstkBits.slice(1);
                        console.log("SLICED", firstkBits)

                        console.log(k, [...binary])
                        let shiftedBinary = [...binary][k];
                        if (!shiftedBinary)
                            firstkBits += "0";
                        else
                            firstkBits += shiftedBinary;
                        k++;
                        console.log("ADDED", firstkBits)

                        console.log(`Scaling d: 2 * ${dtmp} = ${2 * dtmp}`)
                        console.log(`Scaling g: 2 * ${gtmp} = ${2 * gtmp}`)
                        dtmp = 2 * dtmp;
                        gtmp = 2 * gtmp;
                        d.splice(d.length - 1, 1, dtmp);
                        g.splice(g.length - 1, 1, gtmp);
                        isC = false;

                        //[0.5, 1) B
                    } else if (dtmp >= 0.5 && gtmp < 1) {

                        console.log("FIRST BITS", firstkBits)
                        firstkBits = firstkBits.slice(1);
                        console.log("SLICED", firstkBits)

                        console.log(k, [...binary])
                        let shiftedBinary = [...binary][k];
                        if (!shiftedBinary)
                            firstkBits += "0";
                        else
                            firstkBits += shiftedBinary;
                        k++;
                        console.log("ADDED", firstkBits)

                        console.log(`Scaling d: 2 * (${dtmp} - 0.5) = ${2 * (dtmp - 0.5)}`)
                        console.log(`Scaling g: 2 * (${gtmp} - 0.5) = ${2 * (gtmp - 0.5)}`)
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
                } while (!isC)

                decoded += letters.findIndex(x => x.dyst === Fx[j]) + 1;
            }
        }
    }
    return decoded;
}

function printScaled(i, dtmp, gtmp) {
    console.log(`d${i} scaled = ${dtmp.toFixed(3)}`);
    console.log(`g${i} scaled = ${gtmp.toFixed(3)}`);
}

// var marker = findMarker(letters2, "acba");
// var decodedMarker = decodeMarker(letters2, marker, "acba".length);
// console.log(marker, decodedMarker);

// const binary = arithmeticBinaryCode(calculateLettersDystribution(letters2), "acba");

// console.log(binary);
// console.log(decodeArithmeticEncoding(letters2, binary, "acba".length));
// console.log(("0." + binary).parseBinary());
