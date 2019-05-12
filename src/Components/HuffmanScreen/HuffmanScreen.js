import React, { Component } from "react";
import "./HuffmanScreen.css";
import * as notify from "./../../logic/notify";
import * as calc from "./../../logic/calc";

export default class HuffmanScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileToCompress: [],
      fileToDecompress: []
    };
  }
  compressFiles(files) {
    if (files.length < 1)
      notify.showSnackbar(
        "Żaden plik nie został wygrany do skompresowania",
        "error"
      );

    for (let file of files) {
      let reader = new FileReader();

      // eslint-disable-next-line no-loop-func
      reader.onload = e => {
        if (reader.error)
          return notify.showSnackbar(
            "Błąd podczas próby kompresji pliku",
            "error"
          );

        let content = reader.result;

        const letters = calc.calculateLettersProbAndFreq(content);
        const processedLetters = calc.calculateHuffmanCodeForLetters(letters);
        const tree = calc.calculateHuffmanTreeFromLetters(letters);
        console.log(calc.encodeTextUsingHuffmanTree(content, tree));

        // console.log(content, tree, encodedText, decodedText);
      };
      reader.readAsBinaryString(file);
    }
  }
  decompressFiles(files) {
    if (files.length < 1)
      notify.showSnackbar(
        "Żaden plik nie został wygrany do skompresowania",
        "error"
      );
  }
  render() {
    return (
      <div className="huffmanScreen-containter">
        <section className="huffmanScreen-section">
          <h3 className="huffmanScreen-headers">Plik do kompresji</h3>
          <input
            type="file"
            onInput={e => this.compressFiles(e.target.files)}
          />
        </section>
        <section className="huffmanScreen-section">
          <h3 className="huffmanScreen-headers">Plik do dekompresji</h3>
          <input
            type="file"
            onInput={e => this.decompressFiles(e.target.files)}
          />
        </section>
      </div>
    );
  }
}
