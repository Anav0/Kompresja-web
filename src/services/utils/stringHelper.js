export default String.prototype.parseBinary = function parseBinary() {
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

export function allTextSymbolsInArray(text, array) {
    if (!text || !array || array.length <= 0)
        throw new Error("Invalid arguments");

    const symbols = text.split("");
    const uniqueSymbols = [...new Set(symbols)];
    const uniqueLetters = [...new Set(array.map(x => x.letter))];

    const diff = uniqueLetters
        .filter(x => !uniqueSymbols.includes(x))
        .concat(uniqueSymbols.filter(x => !uniqueLetters.includes(x)));

    if (diff.length != 0) return false;

    return true;
}