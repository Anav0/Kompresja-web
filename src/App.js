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
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HuffmanScreen from "./Components/HuffmanScreen/HuffmanScreen";
import _ from "lodash";
import "./App.css";
import * as calc from "./logic/calc";
import * as huffman from "./logic/huffman";
import EncodingDictionary from "./logic/encodingDictionary";
import { connect } from "react-redux";
import { hideSnackbar, showSnackbar } from "./actions";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      letters: [],
      redundancy: 0,
      averageCodeLength: 0,
      entropy: 0,
      generatedText: "",
      huffmanEncoded: "",
      huffmanDecoded: "",
      dictEncoded: "",
      dictDecoded: "",
      dictionary: null,
      dictionaryStringRep: ""
    };
  }

  removeLastNewLineChar(text) {
    let splited = text.split("");
    if (splited[splited.length - 1] == "\n") {
      return splited.slice(0, splited.length - 1).join("");
    }
    return text;
  }
  onFileDecompressed = fileContent => {
    try {
      this.handleCalculationFromFile(fileContent);
    } catch (err) {
      console.error(err);
      this.props.showSnackbar(err.message, "error");
    }
  };
  handleCalculationFromFile = text => {
    try {
      text = this.removeLastNewLineChar(text);
      let tree = huffman.getTreeFromSentence(text);
      let letters = huffman.getLettersFromTree(tree);

      let huffmanEncoded = huffman.encode(text, letters);
      let huffmanDecoded = huffman.decode(huffmanEncoded, tree);

      let redundancy = calc.calculateRedundancy(letters);
      let averageCodeLength = calc.calculateAverageCodeLength(letters);
      let entropy = calc.calculateEntropyForLetters(letters);

      let dictEncoded = "";
      let dictDecoded = "";
      if (this.state.dictionary) {
        dictEncoded = this.state.dictionary.encode(text);
        dictDecoded = this.state.dictionary.decode(dictEncoded);
      } else {
        this.props.showSnackbar(
          "Nie można zakodować przy użyciu słownika, gdyż słownik nie istnieje",
          "warning"
        );
      }

      this.setState(() => ({
        letters: letters,
        generatedText: text,
        averageCodeLength: averageCodeLength,
        entropy: entropy,
        redundancy: redundancy,
        huffmanEncoded: huffmanEncoded,
        huffmanDecoded: huffmanDecoded,
        dictEncoded: dictEncoded,
        dictDecoded: dictDecoded
      }));
    } catch (err) {
      console.error(err);
      return this.props.showSnackbar(err.message, "error");
    }
  };

  showSnackbar = (msg, variant) => {
    this.setState({
      isPopOpen: true,
      popupMessage: msg,
      popupVariant: variant
    });
  };

  onLettersInput = (letters, generatedText) => {
    this.setState(() => ({
      letters: letters,
      entropy: calc.calculateEntropyForLetters(letters),
      redundancy: calc.calculateRedundancy(letters),
      averageCodeLength: calc.calculateAverageCodeLength(letters)
    }));
  };

  onHandInput = (letters, text) => {
    try {
      let huffmanEncoded = huffman.encode(text, _.cloneDeep(letters));
      let tree = huffman.getTreeFromSentence(text);
      let huffmanDecoded = huffman.decode(huffmanEncoded, tree);

      let newDictionary = new EncodingDictionary(text);
      let dictEncoded = newDictionary.encode(text);
      let dictDecoded = newDictionary.decode(dictEncoded);

      letters.map((x, index) => {
        x.id = index;
        x.key = index;
      });

      this.setState(() => ({
        letters: letters,
        generatedText: text,
        huffmanEncoded: huffmanEncoded,
        huffmanDecoded: huffmanDecoded,
        dictEncoded: dictEncoded,
        dictDecoded: dictDecoded,
        dictionaryStringRep: newDictionary.getReadableDictionary(),
        dictionary: newDictionary,
        averageCodeLength: calc.calculateAverageCodeLength(letters),
        entropy: calc.calculateEntropyForLetters(letters),
        redundancy: calc.calculateRedundancy(letters)
      }));
    } catch (err) {
      console.log(err);
      return this.props.showSnackbar(err.message, "error");
    }
  };
  closeSnackBar = () => {
    this.props.hideSnackbar();
  };
  render() {
    var dictionaryElements = [];
    if (this.state.dictionaryStringRep)
      dictionaryElements = this.state.dictionaryStringRep.map((x, index) => (
        <li key={index}>{x}</li>
      ));

    return (
      <Router>
        <main className="App">
          <Snackbar
            className="app-snackBar"
            autoHideDuration={this.props.snackBarOptions.duration}
            anchorOrigin={{
              horizontal: "center",
              vertical: "top"
            }}
            open={this.props.snackBarOptions.isVisible}
            onClose={this.closeSnackBar}
          >
            <MySnackbarContent
              className="letterInput-message"
              variant={this.props.snackBarOptions.variant}
              message={this.props.snackBarOptions.message}
              onClose={this.closeSnackBar}
            />
          </Snackbar>

          <NavBar
            onFileUploaded={this.handleCalculationFromFile}
            className="app-nav"
          />
          <LinearProgress hidden={!this.props.isLoading} color="secondary" />
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
            <Route
              path="/huffman/"
              render={props => (
                <HuffmanScreen
                  onFileDecompressed={fileContent =>
                    this.onFileDecompressed(fileContent)
                  }
                />
              )}
            />
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
              <h4 className="app-expandPanel-header">Kodowanie Huffmana</h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="app-huffman-container">
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Zakodowany:</h4>
                <p className="app-huffman-value">{this.state.huffmanEncoded}</p>
              </section>
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Odkodowany:</h4>
                <p className="app-huffman-value">{this.state.huffmanDecoded}</p>
              </section>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">Kodowanie słownikowe</h4>
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
                <ul className="app-huffman-value">{dictionaryElements}</ul>
              </section>
              <section className="app-huffman-section">
                <h4 className="app-huffman-header">Odkodowane słowo:</h4>
                <p className="app-huffman-value">{this.state.dictDecoded}</p>
              </section>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </main>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.loading.isLoading,
  snackBarOptions: state.snackbar
});

const mapDispatchToProps = dispatch => ({
  hideSnackbar: () => hideSnackbar(dispatch),
  showSnackbar: (message, variant = "error", duration = 2000) =>
    showSnackbar(message, variant, duration)(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
