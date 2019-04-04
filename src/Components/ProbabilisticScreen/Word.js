import React, { Component } from "react";
import "./Word.css";
import {
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from "@material-ui/core";

export default class Word extends Component {
  render() {
    const style = {
      root: {
        padding: "none"
      }
    };
    return (
      <Paper className="word-container">
        <div className="word-letter-occur">
          <h1>{this.props.letter}</h1>
          <h4>Wystąpiła {this.props.occurances} razy</h4>
        </div>
        <Table className={style}>
          <TableHead>
            <TableRow>
              <TableCell>Znak</TableCell>
              <TableCell>Prob.</TableCell>
              <TableCell>Ile</TableCell>
              <TableCell>Dyst.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.letter}</TableCell>
                <TableCell>{row.prob.toFixed(2)}</TableCell>
                <TableCell>{row.occures}</TableCell>
                <TableCell>{row.dyst.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
