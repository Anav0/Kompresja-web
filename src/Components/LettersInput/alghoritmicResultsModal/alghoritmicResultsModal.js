import React, { Component } from 'react'
import "./alghoritmicResultsModal.css"
import PropTypes from "prop-types";
import {
    Paper,
    Dialog
} from '@material-ui/core';

export default class AlghoritmicResultsModal extends Component {
    handleClose = () => {
        this.props.close();
    };
    render() {
        return (
            <Dialog open={this.props.isVisible} onClose={this.handleClose}>
                <Paper className="alghoritmicResultsModal-container" elevation={1}>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Ciąg</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.text}</span>
                    </section>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Znaki</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.letters}</span>
                    </section>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Zakodowany arytmetycznie</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.encoded}</span>
                    </section>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Odkodowany arytmetycznie</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.decoded}</span>
                    </section>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Znacznik</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.marker}</span>
                    </section>
                    <section className="alghoritmicResultsModal-section">
                        <h3>Odkodowany znacznik</h3>
                        <span className="alghoritmicResultsModal-section-value">{this.props.decodedMarker}</span>
                    </section>
                </Paper>
            </Dialog>
        )
    }
}
AlghoritmicResultsModal.propTypes = {
    close: PropTypes.func,
    isVisible: PropTypes.bool,
    letters: PropTypes.string,
    marker: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    decodedMarked: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    decoded: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    encoded: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    text: PropTypes.string
};