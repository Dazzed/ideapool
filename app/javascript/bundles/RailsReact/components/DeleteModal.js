import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class DeleteModal extends Component {
    static propTypes = {
        onCancelDeleteIdea: PropTypes.func.isRequired,
        handleDeleteIdea: PropTypes.func.isRequired,
    }

    render() {
        return (
            <Modal isOpen>
                <ModalBody>
                    <h2 className="modal-title text-center">Are you sure?</h2>
                    <p className="mt-4 popup_text">This idea will be permanently deleted.
                    </p><div className="col-md-12 text-center p-3">
                        <a onClick={this.props.onCancelDeleteIdea} className="idea_popup pointer">CANCEL</a>
                        <a onClick={this.props.handleDeleteIdea} className="idea_popup idea_ok pointer">OK</a>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}
