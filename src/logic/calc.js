export function breakSentenceDown(sentence, trimSentence = true) {
  if (isEmpty(sentence)) return;

  if (trimSentence) sentence = sentence.trim();

  var letters = [];

  var occured = false;

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
  //Calculate probability
  for (var pair of letters) {
    pair.prob = pair.occures / sentence.length;
  }

  return letters;
}

export function calculateEntropy(sentence) {
  if (isEmpty(sentence)) return;

  const brokenDownSentence = breakSentenceDown(sentence);
  console.log(brokenDownSentence);
  if (!brokenDownSentence) return;

  var entropy = 0;

  for (var letter of brokenDownSentence) {
    entropy -= letter.prob * (Math.log(letter.prob) / Math.log(2));
  }

  return entropy;
}

export function loadTxtFile() {
  const file = document.getElementById("file").files[0];
  const result = document.getElementById("result");
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    result.innerHTML = reader.result;
  });
  reader.readAsText(file, "UTF-8");
}

export function generateRandomAsciiString(length = 100) {
  let output = "";

  for (let index = 0; index < length; index++) {
    output = output.concat(String.fromCharCode(getRndInteger(32, 127)));
  }

  return output;
}

//console.log(calculateEntropy("123234545678989a"));

function isEmpty(str) {
  return !str || str.length === 0;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
