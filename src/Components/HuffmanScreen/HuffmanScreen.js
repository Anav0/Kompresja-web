import React, { Component } from "react";
import "./HuffmanScreen.css";
import { connect } from "react-redux";
import { showSnackbar, showLoading, hideLoading } from "../../actions";
import _ from "lodash";
import {
  compressFile,
  getTreeFromFile,
  decompressFile
} from "../../logic/huffman";
import Downloader from "../../logic/downloader";
import { getFileName } from "../../logic/fileProcessor";

class HuffmanScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: null
    };
  }

  compressFiles(files) {
    this.props.showLoading();
    if (!files || files.length < 1)
      return this.props.showSnackbar("Nie wybrano pliku");

    compressFile(files[0]).catch(err => {
      console.error(err);
      this.props.showSnackbar(err.message);
    });
  }

  decompressFiles(files) {
    this.props.showLoading();

    if (!files || files.length < 1)
      return this.props.showSnackbar("Nie wybrano pliku", "error");

    if (!this.state.tree)
      return this.props.showSnackbar(
        "Nie wczytano pliku z drzewem Huffmana",
        "error"
      );

    decompressFile(files[0], this.state.tree)
      .then(data => {
        this.props.onFileDecompressed(data.content);
      })
      .catch(err => {
        this.props.hideLoading();
        console.error(err);
        this.props.showSnackbar(err.message);
      });
  }

  readTreeFromFile = files => {
    this.props.showLoading();
    if (!files || files.length < 1)
      return this.props.showSnackbar("Nie wybrano pliku", "error");

    getTreeFromFile(files[0])
      .then(tree => {
        this.setState(
          () => ({
            tree: tree
          }),
          () => this.props.hideLoading()
        );
      })
      .catch(err => {
        this.props.hideLoading();
        console.error(err);
        this.props.showSnackbar(err.message);
      });
  };

  render() {
    return (
      <div className="huffmanScreen-containter">
        <section className="huffmanScreen-section">
          <h3 className="huffmanScreen-headers">Plik do kompresji</h3>
          <input
            type="file"
            onInput={e => this.compressFiles(e.target.files)}
          />
        </section>
        <div className="huffmanScreen-decompress-section">
          <section className="huffmanScreen-section">
            <h3 className="huffmanScreen-headers">Plik do dekompresji</h3>
            <input
              disabled={!this.state.tree ? true : false}
              type="file"
              onInput={e => this.decompressFiles(e.target.files)}
            />
          </section>
          <section className="huffmanScreen-section">
            <h3 className="huffmanScreen-headers">Drzewo</h3>
            <input
              type="file"
              onInput={e => this.readTreeFromFile(e.target.files)}
            />
          </section>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 2000) =>
    showSnackbar(message, variant, duration)(dispatch),

  showLoading: () => showLoading(dispatch),
  hideLoading: () => hideLoading(dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(HuffmanScreen);
