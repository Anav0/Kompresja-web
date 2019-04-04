import React, { Component } from "react";
import NavBar from "./Components/NavBar/NavBar";
import HandInput from "./Components/HandInput/HandInput";
import ResultsScreen from "./Components/ResultsScreen/ResultsScreen";
import BottomResults from "./Components/BottomResults/BottomResults";
import LettersInput from "./Components/LettersInput/LettersInput";
import MySnackbarContent from "./Components/LettersInput/MySnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";

import "./App.css";
import * as calc from "./logic/calc";
import * as notify from "./logic/notify";

class App extends Component {
  constructor(props) {
    super(props);
    this.showSnackBar = this.showSnackBar.bind(this);
    this.closeSnackBar = this.closeSnackBar.bind(this);
    notify.callbacks.push(this.showSnackBar);
    this.state = {
      results: [],
      redundancy: 0,
      codeLength: 0,
      entropy: 0,
      //1 - hand input
      //2 - table input
      inputMethod: 2,
      handInputText: "Wprowadź zdanie do przetworzenia",
      isPopupOpen: false,
      popupMessage: "",
      popupVariant: "error",
      generatedText: ""
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
    }

    return (
      <main className="App">
        <Snackbar
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
        <ResultsScreen data={this.state.results} className="app-main" />
        <div className="app-inputs">{input}</div>
        <BottomResults
          entropy={this.state.entropy}
          codeLength={this.state.codeLength}
          redundancy={this.state.redundancy}
          className="app-bottomResults"
        />
      </main>
    );
  }
}

export default App;
