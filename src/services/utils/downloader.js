import { addBitsRight, addBitsLeft } from "./bits";

export default class Downloader {
  constructor(bitsGroupSize = 8) {
    this.groupSize = bitsGroupSize;
  }

  downloadWords(words, fileName = "text") {
    if (!words) return;

    const element = document.createElement("a");
    const file = new Blob([words.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName + ".txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  download(content, fileName = "file", format = "text/plain") {
    return new Promise((resolve, reject) => {
      if (!content) reject(new Error("Argument nie może być null"));
      try {
        const element = document.createElement("a");
        const file = new Blob([content], { type: format });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  minimize(bits) {
    if (!bits) throw new Error("Argument nie może być null");
    bits = bits.toString();
    let splited = bits.split("");
    let test = splited.filter(x => x != "1" && x != "0");
    if (test.length != 0) throw new Error("Nieprawidłowa wartość binarna");

    let group = "";
    let output = "";

    for (let i = 0; i < splited.length; i++) {
      if (group.length < this.groupSize) {
        group += splited[i];
      }

      if (group.length == this.groupSize) {
        let number = parseInt(group, 2);
        let character = String.fromCharCode(number);
        output += character;
        group = "";
      }
    }

    if (group != "") {
      let bitsToAdd = group.length % this.groupSize;

      if (bitsToAdd != 0) {
        group = addBitsRight(group, this.groupSize);
        let number = parseInt(group, 2);
        let character = String.fromCharCode(number);
        output += character;
        group = "";
      }
    }

    return output;
  }

  decodeMinimize(code) {
    if (!code) throw new Error("Argument nie może być null");
    let output = "";
    for (let i = 0; i < code.length; i++) {
      const character = code.charCodeAt(i);
      let bajt = character.toString(2);
      bajt = addBitsLeft(bajt, this.groupSize)
      output += bajt;
    }

    return output;
  }
}
