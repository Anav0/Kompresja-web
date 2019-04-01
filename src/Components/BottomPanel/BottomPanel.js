import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import "./BottomPanel.css";
import * as calc from "./../../logic/calc";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
};

class BottomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCalculate = this.calculate.bind(this);
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({ inputValue: e.target.value });
  }
  calculate(e) {
    if (e.key !== "Enter") return;
    let calculationRes = calc.calculateHuffmanCodeForString(
      this.state.inputValue
    );
    //Invoke callback to parent
    this.props.onCalculate(calculationRes);
  }
  render() {
    const { classes } = this.props;
    classes.root += " " + this.props.className;
    classes.root += " bottomPanel-container";
    return (
      <div className={classes.root}>
        <Paper className={"bottomPanel-inputContainer"} elevation={1}>
          <InputBase
            className={"bottomPanel-input"}
            value={this.state.inputValue}
            onChange={this.handleChange}
            type="text"
            placeholder="Wprowadź zdanie do przetworzenia"
            variant="filled"
            onKeyPress={this.handleCalculate}
          />
        </Paper>
      </div>
    );
  }
}
BottomPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BottomPanel);
