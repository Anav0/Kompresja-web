import React from "react";
import PropTypes from "prop-types";
import "./NavBar.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  withStyles
} from "@material-ui/core";
import {
  Code,
  Create,
  TableChart,
  Casino,
  Folder,
  Lock
} from "@material-ui/icons/";
import { connect } from "react-redux";
import { showSnackbar } from "../../actions";
import { Link } from "react-router-dom";
import {getFileExtention, readFileContent} from "../../services/utils";


const styles = {
  root: {},
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -10,
    marginRight: 10
  }
};

class MenuAppBar extends React.Component {
  loadTextFromFile(file) {
    readFileContent(file)
      .then(fileContent => {
        if (getFileExtention(file) == "huff") {
          fileContent = fileContent
            .split("\n")
            .slice(2)
            .join("\n");
        }
        this.props.onFileUploaded(fileContent);
      })
      .catch(err => {
        console.error(err);
        this.props.showSnackbar(err.message, "error");
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Kodowanie i kompresja
            </Typography>
            <Tooltip title="Modele probabilistyczne">
              <IconButton
                className={classes.menuButton}
                component={Link}
                to="/generate"
                aria-haspopup="true"
                color="inherit"
              >
                <Casino />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wprowadź zdanie">
              <IconButton
                component={Link}
                className={classes.menuButton}
                to="/hand"
                aria-haspopup="true"
                color="inherit"
              >
                <Create />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wprowadź litery">
              <IconButton
                className={classes.menuButton}
                component={Link}
                to="/letters"
                aria-haspopup="true"
                color="inherit"
              >
                <TableChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wczytaj tekst z pliku">
              <IconButton
                className={classes.menuButton}
                aria-haspopup="true"
                color="inherit"
                onClick={() =>
                  document.getElementById("navbar-uploadButton").click()
                }
              >
                <Folder />
              </IconButton>
            </Tooltip>
            <input
              id="navbar-uploadButton"
              hidden
              type="file"
              accept="text/plain"
              onChange={e => this.loadTextFromFile(e.target.files[0])}
            />
            <Tooltip title="Huffman">
              <IconButton
                className={classes.menuButton}
                component={Link}
                to="/huffman"
                aria-haspopup="true"
                color="inherit"
              >
                <Lock />
              </IconButton>
            </Tooltip>
            <Tooltip title="Repozytorium">
              <IconButton
                className={classes.menuButton}
                aria-haspopup="true"
                href="https://github.com/anav0/kompresja-web"
                target="_blank"
                color="inherit"
              >
                <Code />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  showSnackbar: (message, variant = "error", duration = 2000) =>
    showSnackbar(message, variant, duration)(dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(MenuAppBar));
