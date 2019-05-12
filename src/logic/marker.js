import { calculateDyst } from "./calc";

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

const letters = [
    { letter: "a", prob: 0.2 },
    { letter: "b", prob: 0.3 },
    { letter: "c", prob: 0.5 }
];
const letters2 = [
    { letter: "a", prob: 0.8 },
    { letter: "b", prob: 0.02 },
    { letter: "c", prob: 0.18 }
];

function findMarker(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];

    letters.sort((a, b) => a.letter - b.letter)
    letters.map(letter => Fx.push(letter.dyst))

    const symbols = textToEncode.split("");
    for (let i = 1; i < symbols.length + 1; i++) {
        let encoding = letters.findIndex(x => x.letter == symbols[i - 1]) + 1;

        let dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding - 1];
        let gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[encoding];

        d.push(dtmp);
        g.push(gtmp);
    }
    return (g[symbols.length] + d[symbols.length]) / 2;
}

function decodeMarker(letters, marker, length, callback) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let code = "";

    letters.sort((a, b) => a.letter - b.letter)
    letters.map(letter => Fx.push(letter.dyst))

    for (let i = 1; i < length + 1; i++) {
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
    callback(code);
}

function arithmeticBinaryCode(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let binary = "";
    let c = false;
    let dtmp = 0;
    let gtmp = 1;

    letters.sort((a, b) => a.letter - b.letter)
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

function improvedArithmeticEncoding(letters, textToEncode) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let binary = "";
    let isD = false;
    let dtmp = 0;
    let gtmp = 1;
    let G = 0;

    letters.sort((a, b) => a.letter - b.letter)
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

function decodeArithmeticEncoding(letters, binary) {
    let d = [0];
    let g = [1];
    let Fx = [0];
    let c = false;
    let dtmp = 0;
    let gtmp = 1;
    let decoded = "";
    letters.sort((a, b) => {
        a.letter - b.letter;
    });

    letters.map(letter => {
        Fx.push(letter.dyst);
    });

    let smallestSection = 99;
    for (let k = 1; k < Fx.length; k++) {
        for (let o = 1; o < Fx.length; o++) {
            if (o == k) continue;

            if (Math.abs(Fx[k] - Fx[o]) < smallestSection)
                smallestSection = Math.abs(Fx[k] - Fx[o]);
        }
    }
    let k = Math.round([-Math.log2(smallestSection)] + 1);
    let firstkBits = binary.substring(0, k);

    let firstBitsDecimal = ("0." + firstkBits).parseBinary();

    for (let h = 1; h < Fx.length; h++) {
        if (Fx[h - 1] < firstBitsDecimal && firstBitsDecimal < Fx[h]) {
            decoded += Fx[h].find(x => x.dyst == Fx[h]);
        }
    }

    for (let i = 1; i < length + 1; i++) {
        let t = (marker - d[i - 1]) / (g[i - 1] - d[i - 1]);

        for (let j = 1; j < Fx.length + 1; j++) {
            if (Fx[j - 1] <= t && t < Fx[j]) {
                let dtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j - 1];
                let gtmp = d[i - 1] + (g[i - 1] - d[i - 1]) * Fx[j];

                d.push(dtmp);
                g.push(gtmp);
                code += letters.findIndex(x => x.dyst === Fx[j]) + 1;
                console.log();
                console.log(`k = ${i}   marker = ${code}`);
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
                break;
            }
        }
    }
    callback(code);
}

function printStep(i, j, t, code, d, g, Fx, dtmp, gtmp, marker) {
    console.log();
    console.log(`k = ${i}   marker = ${code}`);
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

function printStep2(i, encoding, Fx, d, g, gtmp, dtmp) {
    console.log();
    console.log(`n = ${i} binary = ${binary} X${i} = ${encoding}`);
    console.log(
        `d${i} = ${d[i - 1].toFixed(3)} + (${g[i - 1].toFixed(3)} - ${d[
            i - 1
        ].toFixed(3)}) * ${Fx[encoding - 1].toFixed(3)} = ${dtmp.toFixed(3)}`
    );
    console.log(
        `g${i} = ${d[i - 1].toFixed(3)} + (${g[i - 1].toFixed(3)} - ${d[
            i - 1
        ].toFixed(3)}) * ${Fx[encoding].toFixed(3)} = ${gtmp.toFixed(3)}`
    );
}
function printScaled(i, dtmp, gtmp) {
    console.log(`d${i} scaled = ${dtmp.toFixed(3)}`);
    console.log(`g${i} scaled = ${gtmp.toFixed(3)}`);
}
// const marker = findMarker(calculateDyst(letters), "aacbca");
// decodeMarker(calculateDyst(letters), 0.63215699, 10, decodeMarker => {
//   console.log(marker, decodeMarker);
// });

const binary = arithmeticBinaryCode(calculateDyst(letters2), "acba");
const binary2 = improvedArithmeticEncoding(calculateDyst(letters2), "acba");

console.log(binary);
console.log(("0." + binary).parseBinary());

console.log(binary2);
console.log(("0." + binary2).parseBinary());
decodeArithmeticEncoding(calculateDyst(letters2), binary2);
