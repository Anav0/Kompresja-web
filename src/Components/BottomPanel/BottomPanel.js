import React from "react";
import "./BottomPanel.css";
import { TextField, Button } from "@material-ui/core";
import * as calc from "./../../logic/calc";

class BottomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      resultData: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCalculate = this.calculate.bind(this);
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({ inputValue: e.target.value });
  }
  calculate(e) {
    e.preventDefault();
    let calculationRes = calc.calculateHuffmanCodeForString(
      this.state.inputValue
    );
    this.setState((state, props) => ({
      resultData: calculationRes
    }));

    //Invoke callback to parent
    this.props.onCalculate(calculationRes);
  }
  render() {
    return (
      <div className="bottomPanel-container">
        <TextField
          value={this.state.inputValue}
          onChange={this.handleChange}
          type="text"
          label="Wprowadź tekst"
          variant="filled"
        />
        <Button
          onClick={this.handleCalculate}
          variant="contained"
          color="primary"
        >
          Wykonaj obliczenia
        </Button>
      </div>
    );
  }
}
export default BottomPanel;
