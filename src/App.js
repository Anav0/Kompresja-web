import React, { Component } from "react";
import NavBar from "./Components/NavBar/NavBar";
import HandInput from "./Components/HandInput/HandInput";
import ResultsScreen from "./Components/ResultsScreen/ResultsScreen";
import BottomResults from "./Components/BottomResults/BottomResults";
import LettersInput from "./Components/LettersInput/LettersInput";

import "./App.css";
import * as calc from "./logic/calc";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],

      redundancy: 0,
      codeLength: 0,
      entropy: 0,
      //1 - hand input
      //2 - table input
      inputMethod: 2
    };
  }

  downloadAsTxt(text) {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "calc.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  displayData(data) {
    console.log("DATA", data);
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
  render() {
    let input;

    if (this.state.inputMethod == 1) {
      input = (
        <HandInput
          className="app-bottom"
          onCalculate={data => this.displayData(data)}
        />
      );
    } else if (this.state.inputMethod == 2) {
      input = <LettersInput data={this.state.lettersInput} />;
    }

    return (
      <main className="App">
        <NavBar
          onInputMethodChanged={newMethod => this.changeInputMethod(newMethod)}
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
