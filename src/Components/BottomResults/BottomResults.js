import React, { Component } from "react";
import "./BottomResults.css";
import BottomResult from "./BottomResult.js";

export default class BottomResults extends Component {
  render() {
    return (
      <div className="bottomResults-container">
        <BottomResult
          value={+this.props.entropy.toFixed(2)}
          title="Entropia"
          desc="Entropia jest to średnia ilość informacji otrzymanej z każdego znaku"
        />
        <BottomResult
          value={+this.props.averageCodeLength.toFixed(2)}
          title="Średnia długość kodu"
          desc="Średnia długość kodu jest to suma wartości prawdopodobieństwa wystąpienia danego znaku pomnożonego przez ilość bitów potrzebnych do jego zakodowania"
        />
        <BottomResult
          value={+this.props.redundancy.toFixed(2)}
          title="Redundancja"
          desc="Redundancja jest to różnica między entropią a średnią długością kodu Huffmana"
        />
      </div>
    );
  }
}
