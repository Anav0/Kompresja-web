import { withStyles, InputBase, Paper } from "@material-ui/core"
import React from "react";
import { connect } from "react-redux";
import { showSnackbar } from "../../actions";
import "./HandInput.css";
import {getLettersFromTree, getTreeFromSentence} from "../../services/encoding/entropy/huffman";

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
  };
  handleCalculate = (e) => {
    if (e.key !== "Enter") return;
    if (!this.state.inputValue) return;

    try {
      let tree = getTreeFromSentence(
        this.state.inputValue
      );
      let letters = getLettersFromTree(tree);
      this.props.onCalculate(letters, this.state.inputValue);
    }
    catch (err) {
      console.error(err);
      this.props.showSnackbar(err.message, "error");
    }
    //Invoke callback to parent
  };
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

const styles = {
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
};

const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 2000) => showSnackbar(message, variant, duration)(dispatch)
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(HandInput));
