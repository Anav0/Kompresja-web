import React, { Component } from "react";
import "./LettersInput.css";
import * as calc from "./../../logic/calc";
import Downloader from "../../logic/downloader";
import * as huffman from "../../logic/huffman";
import * as marker from "../../logic/marker";
import InputModal from "./inputModal/inputModal";
import AlghoritmicResultsModal from "./alghoritmicResultsModal/alghoritmicResultsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Fab,
  Tooltip,
  InputBase,
  withStyles
} from "@material-ui/core";
import { Casino, InsertDriveFile, ScatterPlot } from "@material-ui/icons";
import { connect } from "react-redux";
import { showSnackbar } from "../../actions";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    fontSize: "1.50rem"
  }
});

class LetterInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [
        { id: 1, letter: "a", prob: 0.8 },
        { id: 2, letter: "b", prob: 0.02 },
        { id: 3, letter: "c", prob: 0.18 }
      ],
      encoded: null,
      rowsAsString: null,
      decoded: null,
      textToEncode: null,
      marker: null,
      decodedMarker: null,
      isInputModalVisible: false,
      isAlghoritmicResultsModalVisible: false
    };
  }

  addNewRow(e) {
    if (e.key !== "Enter") return;
    if (!this.state.newLetter || this.state.newLetter.length > 1)
      return this.props.showSnackbar("Można wprowadzić tylko pojedynczny znak");

    if (this.state.newProb <= 0)
      return this.props.showSnackbar(
        "Prawdopodobieństwo nowego elementu nie może być mniejsze || równe 0"
      );

    if (this.getSumOfRowProbability() > 1)
      return this.props.showSnackbar(
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
    this.setState({ newProb: +e.target.value });
  }
  handleLetterChange(e) {
    e.preventDefault();
    this.setState({ newLetter: e.target.value });
  }

  getSumOfRowProbability = () => {
    return this.state.rows.reduce((prev, curr) => {
      return prev + +curr.prob;
    }, 0);
  };

  generateTextAndHuffmanCode() {
    if (this.getSumOfRowProbability() != 1)
      return this.props.showSnackbar("Prawdopodobieństwo nie sumuje się do 1");

    try {
      let sentence = calc.generateStringWithGivenProb(this.state.rows);
      let tree = huffman.getTreeFromSentence(sentence);
      let letters = huffman.getLettersFromTree(tree);
      this.props.onCalculate(letters, sentence);
    } catch (err) {
      this.props.showSnackbar(err.message, "error");
    }
  }

  handleExistingLetterChange(e, row) {
    if (e.target.value.length != 1)
      return this.props.showSnackbar("Wpisz pojedynczy znak", "error");

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

    if (this.getSumOfRowProbability() > 1)
      return this.props.showSnackbar(
        "Prawdopodobieństwo nie może być większe niż 1",
        "warning",
        5000
      );

    newRows.find(x => {
      return x.id == row.id;
    }).prob = +e.target.value;

    this.setState({
      rows: newRows
    });
  }

  downloadRandomWords = () => {
    let stringBasedOnLetters = calc.generateStringWithGivenProb(
      this.state.rows
    );
    let letters = calc.calculateLetters(stringBasedOnLetters);
    letters = calc.calculateLettersDystribution(letters);
    let words = calc.generateWordsForGivenModel(letters, 4, 100, "B");
    new Downloader().downloadWords(words, "words");
  };

  encodeArithmetically = textToEncode => {
    try {
      if (this.getSumOfRowProbability() != 1)
        return this.props.showSnackbar(
          "Prawdopodobieństwa nie sumują się do jedynki",
          "error"
        );

      let foundMarker = marker.findMarker(this.state.rows, textToEncode);
      let decodedMarker = marker.decodeMarker(
        this.state.rows,
        foundMarker,
        textToEncode.length
      );
      let encoded = marker.arithmeticEncoding(this.state.rows, textToEncode);
      let decoded = marker.decodeArithmeticEncoding(
        this.state.rows,
        encoded,
        textToEncode.length
      );

      let rowsAsString = this.state.rows.reduce((output, row) => {
        return output + ` ${row.letter}: ${row.prob} | `;
      }, "");

      this.setState({
        encoded: encoded,
        decoded: decoded,
        textToEncode: textToEncode,
        marker: foundMarker,
        rowsAsString: rowsAsString,
        decodedMarker: decodedMarker,
        isAlghoritmicResultsModalVisible: true
      });
    } catch (err) {
      this.props.showSnackbar(err.message, "error");
      this.setState({
        isAlghoritmicResultsModalVisible: false
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="letterInput-container">
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
        </Paper>
        <section className="lettersInput-fab">
          <Tooltip title="Oblicz">
            <Fab
              onClick={() => this.generateTextAndHuffmanCode()}
              color="primary"
              className={classes.fab}
            >
              <Casino />
            </Fab>
          </Tooltip>
          <Tooltip title="Utwórz słowa">
            <Fab
              onClick={() => this.downloadRandomWords()}
              color="primary"
              className={classes.fab}
            >
              <InsertDriveFile />
            </Fab>
          </Tooltip>
          <Tooltip title="Zakoduj arytmetycznie">
            <Fab
              onClick={() => this.setState({ isInputModalVisible: true })}
              color="primary"
              className={classes.fab}
            >
              <ScatterPlot />
            </Fab>
          </Tooltip>
        </section>

        <InputModal
          close={() => this.setState({ isInputModalVisible: false })}
          isVisible={this.state.isInputModalVisible}
          onSubmit={textToEncode => this.encodeArithmetically(textToEncode)}
          placeholder="Słowo do zakodowania..."
          header="Kodowanie arytmetyczne"
        />
        <AlghoritmicResultsModal
          encoded={this.state.encoded}
          decoded={this.state.decoded}
          marker={this.state.marker}
          decodedMarker={this.state.decodedMarker}
          letters={this.state.rowsAsString}
          text={this.state.textToEncode}
          close={() =>
            this.setState({ isAlghoritmicResultsModalVisible: false })
          }
          isVisible={this.state.isAlghoritmicResultsModalVisible}
        />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 2000) =>
    showSnackbar(message, variant, duration)(dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(LetterInput));
