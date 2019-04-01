import React, { Component } from "react";
import NavBar from "./Components/NavBar/NavBar";
import BottomPanel from "./Components/BottomPanel/BottomPanel";
import ResultsScreen from "./Components/ResultsScreen/ResultsScreen";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
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
      results: data
    }));
  }
  render() {
    return (
      <main className="App">
        <nav className="app-nav">
          <NavBar />
        </nav>
        <ResultsScreen data={this.state.results} className="app-main" />
        <BottomPanel
          onCalculate={data => this.displayData(data)}
          className="app-bottom"
        />
      </main>
    );
  }
}

export default App;
