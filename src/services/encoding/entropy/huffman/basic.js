
import _ from "lodash";
import {calculateLetters, calculateLettersDystribution, calculateLettersProb} from "../basic";

export function getLettersFromTree(tree) {
  if (!tree)
    throw new Error("Argument funkcji nie może być null ani undefined");

  let copyTree = _.cloneDeep(tree);

  if (copyTree.length < 2) {
    copyTree[0].code = "1";
    return copyTree;
  }

  let fullLength =
    copyTree[0].letter.split("").length + copyTree[1].letter.split("").length;

  //Przypisz słowa kodowe
  while (copyTree.length < fullLength) {
    copyTree.sort((a, b) => (a.letter.length < b.letter.length ? 1 : -1));

    //Get first letter
    var firstLetter = copyTree[0];

    if (!firstLetter.code) firstLetter.code = "";

    if (!firstLetter.combines[0].code) firstLetter.combines[0].code = "";

    if (!firstLetter.combines[1].code) firstLetter.combines[1].code = "";

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
  if (!sentence || sentence.length < 1) throw new Error("Zdanie jest puste");

  var letters = calculateLetters(sentence);
  return getTreeFromLetters(letters);
}

export function getTreeFromLetters(letters) {
  let copyLetters = _.cloneDeep(letters);

  if (!copyLetters || copyLetters.length == 0)
    throw new Error("Tablica znaków jest pusta");

  if (copyLetters.filter(x => !x.prob || !x.dyst).length != 0) {
    //throw new Error("Część symboli nie mają obliczonego prawdopodobieństwa i dystrybuanty");
    copyLetters = calculateLettersProb(copyLetters);
    copyLetters = calculateLettersDystribution(copyLetters);
  }

  if (copyLetters.length == 1) {
    copyLetters[0].code = "0";
    return copyLetters;
  }
  var fullLength = copyLetters.length;
  for (let i = 0; i < fullLength; i++) {
    //Sort by probability descending
    copyLetters.sort((a, b) => (a.prob < b.prob ? 1 : -1));

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

export function decode(encoding, tree, fileLength = -1) {
  if (!encoding || !tree) throw new Error("Brak właściwych argumentów");

  let output = "";
  let copyTree = _.cloneDeep(tree);

  if (copyTree.length < 2) return copyTree[0].letter;

  let splited = encoding.toString().split("");

  toSingleRoot(copyTree);
  let currentNode = copyTree[0];

  let goToRoot = () => {
    output += currentNode.letter;
    currentNode = copyTree[0];
  };

  for (let bit of splited) {
    if (output.length == fileLength) break;

    if (bit == "1") {
      currentNode = currentNode.combines[1];
      if (!currentNode.combines || currentNode.combines.length == 0) {
        goToRoot();
      }
    } else if (bit == "0") {
      currentNode = currentNode.combines[0];
      if (!currentNode.combines || currentNode.combines.length == 0) {
        goToRoot();
      }
    }
  }

  return output;
}

export function encode(text, letters) {
  if (!text || text.length < 1 || !letters || letters.length < 1)
    throw new Error("Brak wymaganych argumentów");

  let copyLetters = _.cloneDeep(letters);
  if (copyLetters.filter(x => !x.code) != 0)
    throw new Error("Część znaków nie ma przypisanego kodu huffmana");

  let output = "";
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
    };
    tree.push(root);
  }
}
