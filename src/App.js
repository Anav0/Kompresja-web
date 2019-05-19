import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import HandInput from "./Components/HandInput/HandInput";
import ResultsScreen from "./Components/ResultsScreen/ResultsScreen";
import BottomResults from "./Components/BottomResults/BottomResults";
import LettersInput from "./Components/LettersInput/LettersInput";
import MySnackbarContent from "./Components/LettersInput/MySnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ProbabilisticScreen from "./Components/ProbabilisticScreen/ProbabilisticScreen";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HuffmanScreen from "./Components/HuffmanScreen/HuffmanScreen";

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
      results: [],
      redundancy: 0,
      codeLength: 0,
      entropy: 0,
      isPopupOpen: false,
      popupMessage: "",
      popupVariant: "error",
      generatedText: "Wprowadź zdanie do przetworzenia",
    };
  }

  downloadGeneratedString = () => {
    if (calc.isEmpty(this.state.generatedText) || this.state.results.length < 1)
      return notify.showSnackbar(
        "Nie można pobrać, bo żaden tekst nie został wygenerowany",
        "warning"
      );

    downloader.download(this.state.generatedText, "calc.txt", "text/plain");
    let content = this.state.results.reduce((code, letter) => {
      return code + letter.code;
    }, "");

    downloader.download(content, "encoding.huff", "octet/stream");
  }
  displayData = (data, generatedText) => {
    let i = 0;

    data.forEach(x => {
      x.id = i;
      i++;
    });

    this.setState((state, props) => ({
      results: data,
      redundancy: calc.calculateRedundancy(data),
      codeLength: calc.calculateAverageCodeLength(data),
      entropy: calc.calculateEntropyForLetters(data),
      generatedText: generatedText
    }));
  }

  handleCalculationFromFile = (text) => {
    let data = huffman.calculateHuffmanCodeForString(text);
    this.displayData(data, text);
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
            onRequestClose={() => this.closeSnackBar()}
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
                  onCalculate={(data, text) => this.displayData(data, text)}
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
              <ResultsScreen data={this.state.results} />
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
                codeLength={this.state.codeLength}
                redundancy={this.state.redundancy}
                className="app-bottomResults"
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </main>
      </Router>
    );
  }
}

export default App;
