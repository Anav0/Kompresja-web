import * as calc from "./calc";
import _ from "lodash";

export function getLettersFromTree(tree) {
    let copyTree = _.cloneDeep(tree);
    let fullLength = tree[0].letter.split("").length + tree[1].letter.split("").length;

    console.log(tree);

    //Przypisz słowa kodowe
    while (copyTree.length < fullLength) {
        copyTree.sort((a, b) => (a.letter.length < b.letter.length) ? 1 : -1)

        //Get first letter
        var firstLetter = copyTree[0];

        if (!firstLetter.code)
            firstLetter.code = "";

        if (!firstLetter.combines[0].code)
            firstLetter.combines[0].code = "";

        if (!firstLetter.combines[1].code)
            firstLetter.combines[1].code = "";

        //Remove it from array
        copyTree = copyTree.slice(1, copyTree.length);

        //Assign code value
        firstLetter.combines[0].code += firstLetter.code + "0";
        firstLetter.combines[1].code += firstLetter.code + "1";

        //Add letters to array
        copyTree.push(firstLetter.combines[0]);
        copyTree.push(firstLetter.combines[1]);
    }


    return copyTree;
}

export function getTreeFromSentence(sentence) {
    var letters = calc.calculateLettersProbAndFreq(sentence);
    return getTreeFromLetters(letters);
}

export function getTreeFromLetters(letters) {
    let copyLetters = _.cloneDeep(letters);

    if (copyLetters.length == 1) {
        copyLetters[0].code = "0";
        return copyLetters;
    }
    var fullLength = copyLetters.length;
    for (let i = 0; i < fullLength; i++) {
        //Sort by probability descending
        copyLetters.sort((a, b) => (a.prob < b.prob) ? 1 : -1)

        //if i=n-2
        if (copyLetters.length == 2) break;

        var last1 = copyLetters[copyLetters.length - 1];
        var last2 = copyLetters[copyLetters.length - 2];

        // last1.code = "";
        // last2.code = "";

        copyLetters = copyLetters.slice(0, copyLetters.length - 2);

        copyLetters.push({
            letter: last1.letter + last2.letter,
            prob: +last1.prob + +last2.prob,
            //code: "",
            occures: last1.occures + +last2.occures,
            combines: [last1, last2]
        });
    }

    copyLetters[0].code = "0";
    copyLetters[1].code = "1";
    return copyLetters;
}

export function decode(encoding, tree) {
    let output = "";
    let copyTree = _.cloneDeep(tree);

    let splited = encoding.toString().split("");

    toSingleRoot(copyTree);
    console.log(copyTree);
    let currentNode = copyTree[0];
    for (let bit of splited) {
        if (bit == "1") {
            if (!currentNode.combines) {
                output += currentNode.letter;
                currentNode = copyTree[0];
            }
            else
                currentNode = currentNode.combines[1];
        }

        if (bit == "0") {
            if (!currentNode.combines) {
                output += currentNode.letter;
                currentNode = copyTree[0];
            }
            else
                currentNode = currentNode.combines[0];
        }
        console.log(bit, currentNode);
    }
    console.log(output);

    return output;
}
export function encodeText(text, letters) {
    let output = "";
    let copyLetters = _.cloneDeep(letters);

    if (copyLetters.filter(x => !x.code) != 0)
        throw new Error("Część znaków nie ma przypisanego kodu huffmana")

    let splited = text.split("");

    for (let sign of splited) {
        let foundLetter = copyLetters.find(x => x.letter == sign);
        output += foundLetter.code;
    }
    return output;
}
function toSingleRoot(tree) {
    if (tree.length > 1) {

        let leftNode = tree.shift();
        let rightNode = tree.shift();

        let root = {
            letter: leftNode.letter + rightNode.letter,
            prob: +leftNode.prob + +rightNode.prob,
            code: "",
            occures: leftNode.occures + +rightNode.occures,
            combines: [leftNode, rightNode]
        }
        tree.push(root);
    }
}
{


    // function searchHuffmanTree(node, matchingLetter) {
    //     if (node.letter == matchingLetter) {
    //         return node;
    //     } else if (node.combines != null) {
    //         let result = null;
    //         for (let i = 0; result == null && i < node.combines.length; i++) {
    //             result = searchHuffmanTree(node.combines[i], matchingLetter);
    //         }
    //         return result;
    //     }
    //     return null;
    // }
}