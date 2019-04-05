import React, { Component } from "react";
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
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./App.css";
import * as calc from "./logic/calc";
import * as notify from "./logic/notify";

class App extends Component {
  constructor(props) {
    super(props);
    this.showSnackBar = this.showSnackBar.bind(this);
    this.closeSnackBar = this.closeSnackBar.bind(this);
    this.showProgressbar = this.showProgressbar.bind(this);
    this.hideProgressbar = this.hideProgressbar.bind(this);

    notify.snackBarCallbacks.push(this.showSnackBar);
    notify.showProgressbarCallbacks.push(this.showProgressbar);
    notify.hideProgressbarCallbacks.push(this.hideProgressbar);

    this.state = {
      results: [],
      redundancy: 0,
      codeLength: 0,
      entropy: 0,
      //1 - hand input
      //2 - table input
      inputMethod: 3,
      handInputText: "Wprowadź zdanie do przetworzenia",
      isPopupOpen: false,
      popupMessage: "",
      popupVariant: "error",
      generatedText: "",
      isLoading: false
    };
  }

  downloadAsTxt() {
    if (calc.isEmpty(this.state.generatedText))
      return notify.showSnackbar(
        "Nie można pobrać, bo żaden tekst nie został wygenerowany",
        "warning"
      );

    const element = document.createElement("a");
    const file = new Blob([this.state.generatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "calc.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  displayData(data, generatedText) {
    this.setState({
      generatedText: generatedText
    });
    let i = 0;

    data.forEach(x => {
      x.id = i;
      i++;
    });

    this.setState((state, props) => ({
      results: data,
      redundancy: calc.calculateRedundancy(data),
      codeLength: calc.calculateAverageCodeLength(data),
      entropy: calc.calculateEntropyForLetters(data)
    }));
  }
  changeInputMethod(newMethod) {
    this.setState({ inputMethod: newMethod });
  }
  handleCalculationFromFile(text) {
    this.setState({
      inputMethod: 1,
      handInputText: text
    });
    this.displayData(calc.calculateHuffmanCodeForString(text));
  }
  showSnackBar(msg, variant) {
    this.setState({
      isPopOpen: true,
      popupMessage: msg,
      popupVariant: variant
    });
  }
  closeSnackBar() {
    this.setState({
      isPopOpen: false
    });
  }
  showProgressbar() {
    this.setState({
      isLoading: true
    });
  }
  hideProgressbar() {
    this.setState({
      isLoading: false
    });
  }
  render() {
    let input;

    if (this.state.inputMethod == 1) {
      input = (
        <HandInput
          placeholder={this.state.handInputText}
          className="app-bottom"
          onCalculate={data => this.displayData(data)}
        />
      );
    } else if (this.state.inputMethod == 2) {
      input = (
        <LettersInput
          onCalculate={(data, generatedText) =>
            this.displayData(data, generatedText)
          }
          data={this.state.lettersInput}
        />
      );
    } else if (this.state.inputMethod == 3) {
      input = (
        <ProbabilisticScreen
          numberOfWords={4}
          data={[{ letter: "d", occures: 2, successors: [] }]}
        />
      );
    }
    return (
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
          onInputMethodChanged={newMethod => this.changeInputMethod(newMethod)}
          onDownloadFile={() => this.downloadAsTxt("Jacek placek")}
          className="app-nav"
        />
        <LinearProgress hidden={!this.state.isLoading} color="secondary" />
        <div className="app-input">{input}</div>
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
    );
  }
}

export default App;
