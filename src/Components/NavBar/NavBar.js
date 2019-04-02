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

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
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

            <Tooltip title="Wprowadź zdanie">
              <IconButton
                onClick={() => this.changeInputMethod(1)}
                aria-haspopup="true"
                color="inherit"
              >
                <Create />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wprowadź litery">
              <IconButton
                onClick={() => this.changeInputMethod(2)}
                aria-haspopup="true"
                color="inherit"
              >
                <TableChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Repozytorium">
              <IconButton
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
