import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import * as calc from "./logic/calc";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCalc = this.calculate.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ inputValue: e.target.value });
  }

  calculate(e) {
    e.preventDefault();

    var letters = [];
    letters.push({ letter: "a", prob: 0.15 });
    letters.push({ letter: "b", prob: 0.04 });
    letters.push({ letter: "c", prob: 0.26 });
    letters.push({ letter: "d", prob: 0.05 });
    letters.push({ letter: "e", prob: 0.5 });

    var result = calc.generateStringWithGivenProb(letters, 1000);
    console.log(result);

    calc.calculateHuffmanCodeForString(result);
  }
  downloadAsTxt(text) {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "calc.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  render() {
    return (
      <div className="App">
        <input
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="testing"
        />

        <Button color="primary" onClick={this.handleCalc} variant="contained">
          Pobierz wyniki obliczeń
        </Button>
      </div>
    );
  }
}

export default App;
