import React, { Component } from "react";
import "./LettersInput.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { TextField, Snackbar } from "@material-ui/core";
import MySnackbarContent from "./MySnackbarContent";
import * as calc from "./../../logic/calc";
import InputBase from "@material-ui/core/InputBase";

export default class LetterInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [
        { id: 1, letter: "a", prob: 0.5 },
        { id: 2, letter: "b", prob: 0.5 }
      ],
      popupMessage: "",
      isPopOpen: false,
      popupVariant: "error"
    };
  }
  showPopup(msg, variant = "error") {
    this.setState({
      isPopOpen: true,
      popupMessage: msg,
      popupVariant: variant
    });
  }
  addNewRow(e) {
    if (e.key !== "Enter") return;
    if (!this.state.newLetter || this.state.newLetter.length > 1)
      return this.showPopup("Można wprowadzić tylko pojedynczny znak");

    if (this.state.newProb <= 0)
      return this.showPopup(
        "Prawdopodobieństwo nowego elementu nie może być mniejsze || równe 0"
      );

    var sum = this.state.rows.reduce((prev, curr) => {
      return +prev + +curr.prob;
    }, +this.state.newProb);

    if (sum > 1)
      return this.showPopup("Prawdopodobieństwo nie może być większe niż 1");

    var newRows = this.state.rows.slice();
    newRows.push({
      id: this.state.rows.length + 1,
      letter: this.state.newLetter,
      prob: this.state.newProb
    });
    this.setState({ rows: newRows });
  }
  handleProbChange(e) {
    e.preventDefault();
    this.setState({ newProb: e.target.value });
  }
  handleLetterChange(e) {
    e.preventDefault();
    this.setState({ newLetter: e.target.value });
  }
  closeSnackBar() {
    this.setState({
      isPopOpen: false
    });
  }
  calculateForLetters() {
    let sum = this.state.rows.reduce((prev, curr) => {
      return prev + +curr.prob;
    }, 0);
    //console.log(this.state.rows);

    //console.log(sum);

    if (sum != 1)
      return this.showPopup("Prawdopodobieństwo nie sumuje się do 1");

    let sentence = calc.generateStringWithGivenProb(this.state.rows, 1000);
    let calculationRes = calc.calculateHuffmanCodeForString(sentence);
    //Invoke callback to parent
    this.props.onCalculate(calculationRes);
  }
  handleExistingLetterChange(e, row) {
    if (e.target.value.length != 1)
      return this.showPopup("Wpisz pojedynczy znak");

    let newRows = this.state.rows;
    let rowToChange = newRows.find(x => {
      return x.id == row.id;
    });
    rowToChange.letter = e.target.value;
    this.setState({
      rows: newRows
    });
  }
  handleExistingProbChange(e, row) {
    let newRows = this.state.rows;
    let sum = newRows.reduce((prev, curr) => {
      return prev + +curr.prob;
    }, +e.target.value);

    console.log(sum);

    if (sum > 1)
      this.showPopup(
        "Prawdopodobieństwo nie może być większe niż 1",
        "warning"
      );

    newRows.find(x => {
      return x.id == row.id;
    }).prob = +e.target.value;

    this.setState({
      rows: newRows
    });
  }
  render() {
    return (
      <Paper>
        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{
            horizontal: "center",
            vertical: "top"
          }}
          open={this.state.isPopOpen}
          onRequestClose={() => this.closeSnackBar()}
          onClose={() => this.closeSnackBar()}
        >
          <MySnackbarContent
            className="letterInput-message"
            variant={this.state.popupVariant}
            message={this.state.popupMessage}
            onClose={() => this.closeSnackBar()}
          />
        </Snackbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Znak</TableCell>
              <TableCell>Prawdopodobieństwo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <InputBase
                    placeholder={row.letter}
                    onChange={e => this.handleExistingLetterChange(e, row)}
                  />
                </TableCell>
                <TableCell>
                  <InputBase
                    placeholder={row.prob.toString()}
                    onChange={e => this.handleExistingProbChange(e, row)}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow key={this.state.rows[this.state.rows.length + 1]}>
              <TableCell>
                <TextField
                  onChange={e => this.handleLetterChange(e)}
                  onKeyPress={e => this.addNewRow(e)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  onChange={e => this.handleProbChange(e)}
                  onKeyPress={e => this.addNewRow(e)}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={() => this.calculateForLetters()} color="primary">
          Oblicz
        </Button>
      </Paper>
    );
  }
}
