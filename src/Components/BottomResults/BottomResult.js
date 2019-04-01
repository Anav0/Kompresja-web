import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Info from "@material-ui/icons/Info";
import Popover, { PopoverAnimationVertical } from "@material-ui/core/Popover";
import "./BottomResult.css";

export default class BottomResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPopOpen: false
    };
  }

  handlePop(e) {
    e.preventDefault();
    this.setState({
      isPopOpen: !this.state.isPopOpen,
      anchorEl: e.currentTarget
    });
  }
  render() {
    const popLocation = { vertical: "top", horizontal: "right" };
    return (
      <Paper
        className={"bottomResult-container"}
        id="bottomResult-root"
        elevation={1}
        onClick={this.handlePop.bind(this)}
      >
        <h1>{this.props.value}</h1>
        <h3>{this.props.title}</h3>
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={popLocation}
          targetOrigin={popLocation}
          elevation={1}
          open={this.state.isPopOpen}
          animation={PopoverAnimationVertical}
        >
          <p className="bottomResult-desc">{this.props.desc}</p>
        </Popover>
        {/* TODO: This div exist only so opacity animation can take effect */}
        <div className={"bottomResult-info-icon"}>
          <Info fontSize="small" />
        </div>
      </Paper>
    );
  }
}
