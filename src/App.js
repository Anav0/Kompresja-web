import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import HandInput from "./Components/HandInput/HandInput";
import ResultsScreen from "./Components/ResultsScreen/ResultsScreen";
import BottomResults from "./Components/BottomResults/BottomResults";
import LettersInput from "./Components/LettersInput/LettersInput";
import MySnackbarContent from "./Components/LettersInput/MySnackbarContent";
import ProbabilisticScreen from "./Components/ProbabilisticScreen/ProbabilisticScreen";
import {
  Snackbar,
  LinearProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core/"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HuffmanScreen from "./Components/HuffmanScreen/HuffmanScreen";
import _ from "lodash";
import "./App.css";
import * as calc from "./logic/calc";
import * as huffman from "./logic/huffman";
import * as notify from "./logic/notify";
import * as downloader from "./logic/downloader";
import EncodingDictionary from "./logic/encodingDictionary";

class App extends Component {
  constructor(props) {
    super(props);

    notify.snackBarCallbacks.push(this.showSnackBar);

    this.state = {
      letters: [],
      redundancy: 0,
      averageCodeLength: 0,
      entropy: 0,
      isPopupOpen: false,
      popupMessage: "",
      popupVariant: "error",
      generatedText: "",
      huffmanEncodedText: "",
      huffmanDecodedText: "",
      dictEncoded: "",
      dictionary: null,
      dictionaryStringRep: "",
    };
  }

  downloadGeneratedString = () => {
    if (calc.isEmpty(this.state.generatedText) || this.state.letters.length < 1)
      return notify.showSnackbar(
        "Nie można pobrać, bo żaden tekst nie został wygenerowany",
        "warning"
      );

    downloader.download(this.state.generatedText, "calc.txt", "text/plain");
    let content = this.state.letters.reduce((code, letter) => {
      return code + letter.code;
    }, "");

    downloader.download(content, "encoding.huff", "octet/stream");
  }

  handleCalculationFromFile = (text) => {
    try {
      let tree = huffman.getTreeFromSentence(text);
      let letters = huffman.getLettersFromTree(tree);

      console.log(text, letters, tree);

      let huffmanEncoded = huffman.encode(text, letters);
      let huffmanDecoded = huffman.decode(huffmanEncoded, tree);
      let dictEncoded = this.state.dictionary.encode(text);

      this.setState(() => ({
        letters: letters,
        generatedText: text,
        huffmanEncoded: huffmanEncoded,
        huffmanDecoded: huffmanDecoded,
        dictEncoded: dictEncoded
      }));

    }
    catch (err) {
      console.error(err);
      notify.showSnackbar(err.message);
    }
  }

  showSnackBar = (msg, variant) => {
    this.setState({
      isPopOpen: true,
      popupMessage: msg,
      popupVariant: variant
    });
  }

  closeSnackBar = () => {
    this.setState({
      isPopOpen: false
    });
  }

  onLettersInput = (letters, generatedText) => {
    this.setState(() => ({
      letters: letters,
      entropy: calc.calculateEntropyForLetters(letters),
      redundancy: calc.calculateRedundancy(letters),
      averageCodeLength: calc.calculateAverageCodeLength(letters),
    }))
  }

  onHandInput = (letters, text) => {
    try {
      let huffmanEncoded = huffman.encode(text, _.cloneDeep(letters));
      let tree = huffman.getTreeFromSentence(text);
      let huffmanDecoded = huffman.decode(huffmanEncoded, tree)

      let newDictionary = new EncodingDictionary(text);
      let dictEncoded = newDictionary.encode(text);

      let dictionaryRepresentation = newDictionary.dictionary.reduce((output, x, index) => {
        if (x == " ")
          x = "spacja"
        return output + `${x} \t ${index.toString(2)}|`
      }, "").split("|");

      dictionaryRepresentation = dictionaryRepresentation.filter(x => x != "");


      letters.map((x, index) => {
        x.id = index;
        x.key = index;
      })

      this.setState(() => ({
        letters: letters,
        generatedText: text,
        huffmanEncodedText: huffmanEncoded,
        huffmanDecodedText: huffmanDecoded,
        dictEncoded: dictEncoded,
        dictionaryStringRep: dictionaryRepresentation,
        dictionary: newDictionary,
        averageCodeLength: calc.calculateAverageCodeLength(letters),
        entropy: calc.calculateEntropyForLetters(letters),
        redundancy: calc.calculateRedundancy(letters),
      }));
    }
    catch (err) {
      console.log(err);
      notify.showSnackbar(err.message, "error");
    }
  }

  render() {
    var dictionaryElements = [];
    if (this.state.dictionaryStringRep)
      dictionaryElements = this.state.dictionaryStringRep.map((x, index) =>
        <li key={index}>{x}</li>
      );
    console.log(this.state.dictionaryStringRep);

    return (
      <Router>
        <main className="App">
          <Snackbar
            className="app-snackBar"
            autoHideDuration={3000}
            anchorOrigin={{
              horizontal: "center",
              vertical: "top"
            }}
            open={this.state.isPopOpen}
            onClose={this.closeSnackBar}
          >
            <MySnackbarContent
              className="letterInput-message"
              variant={this.state.popupVariant}
              message={this.state.popupMessage}
              onClose={this.closeSnackBar}
            />
          </Snackbar>

          <NavBar
            onFileUploaded={this.handleCalculationFromFile}
            onDownloadFile={this.downloadGeneratedString}
            className="app-nav"
          />
          <LinearProgress hidden={!this.state.isLoading} color="secondary" />
          {/* <div className="app-input">{input}</div> */}
          <section className="app-input">
            <Route path="/" exact component={ProbabilisticScreen} />
            <Route
              path="/hand/"
              render={props => (
                <HandInput
                  placeholder="Wprowadź zdanie"
                  onCalculate={this.onHandInput}
                />
              )}
            />
            <Route
              path="/letters/"
              render={props => (
                <LettersInput
                  onCalculate={this.onLettersInput}
                  data={this.state.lettersInput}
                />
              )}
            />
            <Route path="/generate/" component={ProbabilisticScreen} />
            <Route path="/huffman/" component={HuffmanScreen} />
          </section>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">Znaki</h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ResultsScreen data={this.state.letters} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">
                Entropia, średnia długość kodu i redundancja
              </h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <BottomResults
                entropy={this.state.entropy}
                averageCodeLength={this.state.averageCodeLength}
                redundancy={this.state.redundancy}
                className="app-bottomResults"
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">
                Kodowanie Huffmana
              </h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="app-huffman-container">
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Zakodowany:</h4>
                <p className="app-huffman-value">{this.state.huffmanEncodedText}</p>
              </section>
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Odkodowany:</h4>
                <p className="app-huffman-value">{this.state.huffmanDecodedText}</p>
              </section>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">
                Kodowanie słownikowe
              </h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="app-huffman-container">
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Zakodowany:</h4>
                <p className="app-huffman-value">{this.state.dictEncoded}</p>
              </section>
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Słowo:</h4>
                <p className="app-huffman-value">{this.state.generatedText}</p>
              </section>
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Słownik:</h4>
                <ul className="app-huffman-value">
                  {dictionaryElements}
                </ul>
              </section>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </main>
      </Router >
    );
  }
}

export default App;
