import React, { Component } from "react";
import "./ProbabilisticScreen.css";
import Word from "./Word";
import { Fab, Tooltip, withStyles } from "@material-ui/core";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import { connect } from "react-redux";
import { showSnackbar } from "../../actions";
import {generateProbModelForGivenWords, generateWordsForGivenModel} from "../../services/encoding/generator";
import Downloader from "../../services/utils/downloader";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    fontSize: "1.50rem"
  }
});

class ProbabilisticScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfWords: 0,
      loadedWords: []
    };
  }

  loadProbModelFromFile(file) {
    if (file.type != "text/plain")
      return this.props.showSnackbar("Niedozowlone rozszerzenie pliku");

    let fileReader = new FileReader();
    fileReader.onloadend = e => {
      let words = fileReader.result.split(/\r?\n/);
      let model = generateProbModelForGivenWords(words);
      this.setState({
        numberOfWords: words.length - 1,
        loadedWords: model
      });
    };
    fileReader.readAsText(file);
  }
  isModelLoaded = () => {
    if (this.state.loadedWords.length < 1) return false;
    else return true;
  };
  generateWordsBasedOnModel(variant) {
    try {
      if (!this.isModelLoaded())
        return this.props.showSnackbar(
          "Zanim wygenerujesz słowa, stwórz model, wczytując plik zawierający przykładowe słowa"
        );
      let words = generateWordsForGivenModel(
        this.state.loadedWords,
        4,
        100,
        variant
      );

      new Downloader().downloadWords(words, "words");
    } catch (err) {
      console.error(err);
      this.props.showSnackbar(err.message);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <section className="probScreen-container">
        <h2 className="probScreen-words">
          Ilość wczytanych słów: {this.state.numberOfWords}
        </h2>
        <ul className="probScreen-words-container">
          {this.state.loadedWords.map(row => {
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
          <Tooltip title="Generuj słowa w oparciu o wczytany model">
            <Fab
              onClick={() => this.generateWordsBasedOnModel("B")}
              color="primary"
              className={classes.fab}
            >
              B
            </Fab>
          </Tooltip>
          <Tooltip title="Generuj słowa w oparciu o wczytany model">
            <Fab
              onClick={() => this.generateWordsBasedOnModel("C")}
              color="primary"
              className={classes.fab}
            >
              C
            </Fab>
          </Tooltip>
          <Tooltip title="Generuj słowa w oparciu o wczytany model">
            <Fab
              disabled
              onClick={() => this.generateWordsBasedOnModel("D")}
              color="primary"
              className={classes.fab}
            >
              D
            </Fab>
          </Tooltip>
          <Tooltip title="Wczytaj model">
            <Fab
              onClick={() =>
                document.getElementById("probScreen-loadButton").click()
              }
              color="secondary"
              className={classes.fab}
            >
              <InsertDriveFile />
            </Fab>
          </Tooltip>
          <input
            id="probScreen-loadButton"
            hidden
            type="file"
            accept="text/plain"
            onChange={e => this.loadProbModelFromFile(e.target.files[0])}
          />
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 5000) =>
    showSnackbar(message, variant, duration)(dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ProbabilisticScreen));
