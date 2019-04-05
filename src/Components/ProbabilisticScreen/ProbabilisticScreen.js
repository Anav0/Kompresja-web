import React, { Component } from "react";
import "./ProbabilisticScreen.css";
import Word from "./Word";
import { Fab, Icon, Tooltip, withStyles } from "@material-ui/core";
import Casino from "@material-ui/icons/Casino";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import * as notify from "./../../logic/notify";
import * as calc from "./../../logic/calc";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  }
});

class ProbabilisticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfWords: 0,
      data: []
    };
  }

  loadProbModelFromFile(file, type) {
    if (type != "text/plain")
      return notify.showSnackbar("Niedozowlone rozszerzenie pliku", "error");

    let fileReader = new FileReader();
    fileReader.onloadend = e => {
      let words = fileReader.result.split(/\r?\n/);
      const results = calc.generateProbModelForGivenWords(words);
      this.setState({
        numberOfWords: words.length - 1,
        data: results
      });
    };
    fileReader.readAsText(file);
  }
  render() {
    const { classes } = this.props;
    return (
      <section className="probScreen-container">
        <h2 className="probScreen-words">
          Ilość wczytanych słów: {this.state.numberOfWords}
        </h2>
        <ul className="probScreen-words-container">
          {this.state.data.map(row => {
            return (
              <Word
                letter={row.letter}
                occurances={row.occures}
                rows={row.successors}
              />
            );
          })}
        </ul>
        <div className="probScreen-fab-container">
          <Tooltip title="Generuj słowa">
            <Fab m={1} color="primary" aria-label="Add" className={classes.fab}>
              <Casino />
            </Fab>
          </Tooltip>
          <Tooltip title="Wczytaj model">
            <Fab color="secondary" aria-label="Edit" className={classes.fab}>
              <label htmlFor="probScreen-loadButton">
                <InsertDriveFile />
              </label>
            </Fab>
          </Tooltip>
          <input
            id="probScreen-loadButton"
            hidden
            type="file"
            accept="text/plain"
            onChange={e =>
              this.loadProbModelFromFile(
                e.target.files[0],
                e.target.files[0].type
              )
            }
          />
        </div>
      </section>
    );
  }
}
export default withStyles(styles)(ProbabilisticScreen);