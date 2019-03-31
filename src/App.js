import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import NavBar from "./Components/NavBar/NavBar";
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
      <main className="App">
        <nav className="app-nav">
          <NavBar />
        </nav>
        <div className="app-main">
          <TextField label="Name" />
        </div>
        <div className="app-bottom">
          <TextField label="Name" />
        </div>
      </main>
    );
  }
}

export default App;
