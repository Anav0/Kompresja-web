import React, { Component } from "react";
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
    const results = calc.breakSentenceDown(this.state.inputValue);
    console.log(results);
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
        <button onClick={this.handleCalc}>Pobierz wyniki obliczeń</button>
      </div>
    );
  }
}

export default App;
