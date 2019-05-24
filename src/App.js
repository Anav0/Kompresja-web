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

class App extends Component {
  constructor(props) {
    super(props);

    notify.snackBarCallbacks.push(this.showSnackBar);

    this.state = {
      letters: [],
      redundancy: 0,
      codeLength: 0,
      entropy: 0,
      isPopupOpen: false,
      popupMessage: "",
      popupVariant: "error",
      generatedText: "",
      huffmanEncodedText: "",
      huffmanDecodedText: ""
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

  displayData = (letters, generatedText, encoded = "", decoded = "") => {
    let i = 0;

    letters.forEach(x => {
      x.id = i;
      i++;
    });

    this.setState(() => ({
      letters: letters,
      redundancy: calc.calculateRedundancy(letters),
      codeLength: calc.calculateAverageCodeLength(letters),
      entropy: calc.calculateEntropyForLetters(letters),
      generatedText: generatedText,
      huffmanEncodedText: encoded,
      huffmanDecodedText: decoded,
    }));

  }

  handleCalculationFromFile = (text) => {
    let tree = huffman.getTreeFromSentence(text);
    let letters = huffman.getLettersFromTree(tree);
    this.displayData(letters, text);
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

  onHandInput = (letters, text) => {
    try {
      let encoded = huffman.encode(text, _.cloneDeep(letters));
      let tree = huffman.getTreeFromSentence(text);
      let decoded = huffman.decode(encoded, tree)
      this.displayData(letters, text, encoded, decoded)
    }
    catch (err) {
      console.log(err);
      notify.showSnackbar(err.message, "error");
    }
  }

  render() {
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
            onClose={() => this.closeSnackBar()}
          >
            <MySnackbarContent
              className="letterInput-message"
              variant={this.state.popupVariant}
              message={this.state.popupMessage}
              onClose={() => this.closeSnackBar()}
            />
          </Snackbar>

          <NavBar
            onFileUploaded={text => this.handleCalculationFromFile(text)}
            onDownloadFile={() => this.downloadGeneratedString("Jacek placek")}
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
                  onCalculate={(letters, text) => this.onHandInput(letters, text)}
                />
              )}
            />
            <Route
              path="/letters/"
              render={props => (
                <LettersInput
                  onCalculate={(data, generatedText) =>
                    this.displayData(data, generatedText)
                  }
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
                Entropia, średnia długość kodu, redundancja
              </h4>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <BottomResults
                entropy={this.state.entropy}
                codeLength={this.state.codeLength}
                redundancy={this.state.redundancy}
                className="app-bottomResults"
              />
            </ExpansionPanelDetails>

          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h4 className="app-expandPanel-header">
                Zakodowany / odkodowany ciąg
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
        </main>
      </Router >
    );
  }
}

export default App;
