import React, { Component } from 'react'
import "./inputModal.css"
import PropTypes from "prop-types";

import {
    Dialog,
    Button,
    Paper,
    InputBase
} from '@material-ui/core';

export default class InputModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: "",
        }
    }
    handleEnter = (e) => {
        if (e.key !== "Enter") return;
        this.handleSubmit();
    };
    handleSubmit = () => {
        let trimedInput = this.state.inputValue.trim();
        if (trimedInput == "")
            return;
        this.props.onSubmit(trimedInput);
        this.handleClose();
    };
    handleChange = (e) => {
        this.setState({ inputValue: e.target.value })
    };
    handleClose = () => {
        this.props.close();
    };
    render() {
        return (
            <Dialog open={this.props.isVisible} onClose={this.handleClose}>
                <Paper className="inputModal-container" elevation={1}>
                    <h3 className="inputModal-header">{this.props.header}</h3>
                    <InputBase
                        className={"inputModal-input"}
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                        type="text"
                        placeholder={this.props.placeholder}
                        variant="filled"
                        onKeyPress={this.handleEnter}
                        autoFocus={true}
                    />
                    <Button onClick={this.handleSubmit} variant="contained" color="primary">
                        OK
                    </Button>
                </Paper>
            </Dialog>
        )
    }
}
InputModal.propTypes = {
    close: PropTypes.func,
    onSubmit: PropTypes.func,
    isVisible: PropTypes.bool,
    header: PropTypes.string,
    placeholder: PropTypes.string,
};