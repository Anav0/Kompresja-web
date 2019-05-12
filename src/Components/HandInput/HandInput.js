import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import "./HandInput.css";
import * as calc from "../../logic/calc";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const styles = {
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
};

class HandInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ inputValue: e.target.value });
  }
  handleCalculate = (e) => {
    if (e.key !== "Enter") return;
    if (calc.isEmpty(this.state.inputValue)) return;

    let calculationRes = calc.calculateHuffmanCodeForString(
      this.state.inputValue
    );
    //Invoke callback to parent
    this.props.onCalculate(calculationRes, this.state.inputValue);
  }
  render() {
    const { classes } = this.props;
    classes.root += " " + this.props.className;
    classes.root += " HandInput-container";
    return (
      <div className={classes.root}>
        <Paper className={"HandInput-inputContainer"} elevation={1}>
          <InputBase
            className={"HandInput-input"}
            value={this.state.inputValue}
            onChange={this.handleChange}
            type="text"
            placeholder={this.props.placeholder}
            variant="filled"
            onKeyPress={this.handleCalculate}
          />
        </Paper>
      </div>
    );
  }
}
HandInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HandInput);
