import React, { Component } from "react";
import "./HuffmanScreen.css";
import { readFileContent } from "./../../logic";
import { connect } from "react-redux";
import { showSnackbar } from "../../actions"

class HuffmanScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileToCompress: [],
      fileToDecompress: []
    };
  }
  compressFiles(files) {

    if (!files || files.length < 1)
      this.props.showSnackbar(
        "Żaden plik nie został wgrany do skompresowania",
        "error"
      );

    try {
      readFileContent(files[0]).then((content) => {
        console.log(content);
      }).catch(err => {
        console.log(err);
        this.props.showSnackbar(err.message);
      })
    } catch (err) {
      console.log(err);
      this.props.showSnackbar(err.message);
    }
  }

  decompressFiles(files) {
    if (files.length < 1)
      this.props.showSnackbar(
        "Żaden plik nie został wygrany do skompresowania",
        "error"
      );
  }
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
        <section className="huffmanScreen-section">
          <h3 className="huffmanScreen-headers">Plik do dekompresji</h3>
          <input
            type="file"
            onInput={e => this.decompressFiles(e.target.files)}
          />
        </section>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 2000) => showSnackbar(message, variant, duration)(dispatch)

})

export default connect(null, mapDispatchToProps)(HuffmanScreen);