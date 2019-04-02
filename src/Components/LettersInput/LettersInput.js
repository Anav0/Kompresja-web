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

export default class LetterInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [
        { id: 1, letter: "a", prob: 0.5 },
        { id: 2, letter: "b", prob: 0.5 }
      ],
      popupMessage: "",
      isPopOpen: false
    };
  }
  handlePop(e, msg) {
    this.setState({
      isPopOpen: !this.state.isPopOpen,
      popupMessage: msg,
      anchorEl: e.currentTarget
    });
  }
  onAddNewRow(e) {
    if (e.key !== "Enter") return;
    if (!this.state.newLetter || this.state.newLetter.length > 1)
      return this.handlePop(e, "Można wprowadzić tylko pojedynczny znak");

    if (!(this.state.newProb <= 1 || this.state.newProb > 0))
      return this.handlePop(e, "Prawdopodobieństwo nie może być większe niż 1");

    var sum = this.state.rows.reduce((prev, curr) => {
      return +prev + +curr.prob;
    }, +this.state.newProb);

    if (sum >= 1) return;

    this.setState((state, props) => ({
      rows: [
        ...state.rows,
        {
          id: state.rows.length + 1,
          letter: state.newLetter,
          prob: state.newProb
        }
      ]
    }));
  }
  handleProbChange(e) {
    e.preventDefault();

    this.setState({ newProb: e.target.value });
  }
  handleLetterChange(e) {
    e.preventDefault();
    //TODO: limit number of character to ONE

    this.setState({ newLetter: e.target.value });
  }
  closeSnackBar() {
    this.setState({
      isPopOpen: false
    });
  }
  render() {
    return (
      <Paper>
        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={this.state.isPopOpen}
          onRequestClose={() => this.closeSnackBar()}
          onClose={() => this.closeSnackBar()}
        >
          <MySnackbarContent
            className="letterInput-message"
            variant="error"
            message={this.state.popupMessage}
            onClose={() => this.closeSnackBar()}
          />
        </Snackbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Znak</TableCell>
              <TableCell align="right">Prawdopodobieństwo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.letter}
                </TableCell>
                <TableCell align="right">{row.prob}</TableCell>
              </TableRow>
            ))}
            <TableRow key={this.state.rows[this.state.rows.length + 1]}>
              <td>
                <TextField
                  onChange={e => this.handleLetterChange(e)}
                  onKeyPress={e => this.onAddNewRow(e)}
                />
              </td>
              <td>
                <TextField
                  onChange={e => this.handleProbChange(e)}
                  onKeyPress={e => this.onAddNewRow(e)}
                />
              </td>
            </TableRow>
          </TableBody>
        </Table>
        <Button color="primary">Oblicz</Button>
      </Paper>
    );
  }
}
