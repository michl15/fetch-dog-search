import React from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";

const ModalContainer = styled(Modal)`
    text-align: center;
`
const ModalImage = styled.img`
    width: 100%;
    border-radius: 15px;
`

/**
 * Modal component to display match results
 * 
 * @param {object} dog - Dog object with data about the dog
 * @param {boolean} isVisible - flag to show or hide the modal
 * @param {function} onClose - handler for the close button
 * @returns MatchModal component
 */
const MatchModal = ({dog, isVisible, onClose}) => {
    return (
        <ModalContainer show={isVisible} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Matched!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalImage src={dog.img} alt="dog"/>
                <h1>{dog.name}</h1>
                <Button onClick={onClose}>Keep Searching</Button>
            </Modal.Body>
        </ModalContainer>
    )
}

export default MatchModal;