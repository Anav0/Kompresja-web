import {
  readFileContent,
  getFileExtention,
  getFileName
} from "../fileProcessor";
import Downloader from "../downloader";
import {
  encode,
  getLettersFromTree,
  getTreeFromSentence,
  decode
} from "./basic";
import _ from "lodash";
const downloader = new Downloader(8);

export function compressFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error("Argument cannot be null"));
    readFileContent(file).then(content => {
      try {
        let tree = getTreeFromSentence(content);
        let letters = getLettersFromTree(tree);
        let huffmanEncoded = encode(content, _.cloneDeep(letters));
        let filename = getFileName(file);
        let charLength = content.length;

        downloader
          .download(
            `${file.type}\n${charLength}\n${downloader.minimize(
              huffmanEncoded
            )}`,
            `${filename}.huff`
          )
          .then(() => {
            setTimeout(() => {
              downloader
                .download(JSON.stringify(tree), `drzewo.${filename}.txt`)
                .catch(err => {
                  console.error(err);
                  reject(err);
                });
            }, 500);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });

    resolve();
  });
}

export function getTreeFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error("Argument cannot be null"));
    readFileContent(file)
      .then(content => {
        let parsed = JSON.parse(content);

        resolve(parsed);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function decompressFile(file, tree) {
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error("Argument cannot be null"));

    if (getFileExtention(file) != "huff")
      reject(new Error("Nieprawidłowe rozszerzenie pliku"));

    readFileContent(file)
      .then(content => {
        let splited = content.split("\n");
        let originalFileType = splited[0];
        let originalTextLength = splited[1];
        content = splited.slice(2).join("\n");
        let huffmanBits = downloader.decodeMinimize(content);

        resolve({
          content: decode(huffmanBits, tree, originalTextLength),
          type: originalFileType
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
