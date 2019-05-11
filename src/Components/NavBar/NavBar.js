import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import Code from "@material-ui/icons/Code";
import Create from "@material-ui/icons/Create";
import TableChart from "@material-ui/icons/TableChart";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Folder from "@material-ui/icons/Folder";
import Casino from "@material-ui/icons/Casino";
import Lock from "@material-ui/icons/Lock";

import "./NavBar.css";
import * as notify from "./../../logic/notify";
import { Link } from "react-router-dom";

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
  state = {
    auth: true,
    anchorEl: null
  };
  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  changeInputMethod(newMethod) {
    this.props.onInputMethodChanged(newMethod);
  }
  loadTextFromFile(file, type) {
    if (type !== "text/plain")
      return notify.showSnackbar("Niedozowlone rozszerzenie pliku", "error");

    let fileReader = new FileReader();
    fileReader.onloadend = e => {
      this.props.onFileUploaded(fileReader.result);
    };
    fileReader.readAsText(file);
  }
  downloadGeneratedString() {
    this.props.onDownloadFile();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
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
            <Tooltip title="Pobierz">
              <IconButton
                className={classes.menuButton}
                aria-haspopup="true"
                color="inherit"
                onClick={() => this.downloadGeneratedString()}
              >
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wczytaj z pliku">
              <IconButton
                className={classes.menuButton}
                aria-haspopup="true"
                color="inherit"
              >
                <label htmlFor="navbar-uploadButton">
                  <Folder />
                </label>
              </IconButton>
            </Tooltip>
            <input
              id="navbar-uploadButton"
              hidden
              type="file"
              accept="text/plain"
              onChange={e =>
                this.loadTextFromFile(e.target.files[0], e.target.files[0].type)
              }
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

export default withStyles(styles)(MenuAppBar);
