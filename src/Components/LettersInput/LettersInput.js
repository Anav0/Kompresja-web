import React, { Component } from "react";
import "./LettersInput.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import * as calc from "./../../logic/calc";
import * as notify from "./../../logic/notify";
import InputBase from "@material-ui/core/InputBase";

export default class LetterInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [
        { id: 1, letter: "a", prob: 0.5 },
        { id: 2, letter: "b", prob: 0.5 }
      ]
    };
  }

  addNewRow(e) {
    if (e.key !== "Enter") return;
    if (!this.state.newLetter || this.state.newLetter.length > 1)
      return notify.showSnackbar("Można wprowadzić tylko pojedynczny znak");

    if (this.state.newProb <= 0)
      return notify.showSnackbar(
        "Prawdopodobieństwo nowego elementu nie może być mniejsze || równe 0"
      );

    var sum = this.state.rows.reduce((prev, curr) => {
      return +prev + +curr.prob;
    }, +this.state.newProb);

    if (sum > 1)
      return notify.showSnackbar(
        "Prawdopodobieństwo nie może być większe niż 1"
      );

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

  async calculateForLettersAsync() {
    notify.showProgressbar();
    await this.calculateForLetters().then(results => {
      notify.hideProgressbar();
    });
  }

  calculateForLetters() {
    return new Promise(resolve => {
      let sum = this.state.rows.reduce((prev, curr) => {
        return prev + +curr.prob;
      }, 0);

      if (sum != 1)
        return notify.showSnackbar("Prawdopodobieństwo nie sumuje się do 1");

      let sentence = calc.generateStringWithGivenProb(this.state.rows);
      let calculationRes = calc.calculateHuffmanCodeForString(sentence);
      //Invoke callback to parent
      this.props.onCalculate(calculationRes, sentence);
      resolve();
    });
  }
  handleExistingLetterChange(e, row) {
    if (e.target.value.length != 1)
      return notify.showSnackbar("Wpisz pojedynczy znak");

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
      notify.showSnackbar(
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
        <Button onClick={() => this.calculateForLettersAsync()} color="primary">
          Oblicz
        </Button>
      </Paper>
    );
  }
}
