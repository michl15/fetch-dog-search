import React from "react";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";

const MatchFinderContainer = styled(Card)`
    max-width: 400px;
    margin: auto;
    padding: 20px 10px;
`

const MatchFinder = ({onMatchFind, buttonDisabled}) => {
    // Add a tooltip to instruct users to favorite a dog
    const renderTooltip = () => (
        <Tooltip id="match-tooltip-info">
            You must favorite at least one dog to match!
        </Tooltip>
    )

    return (
        <MatchFinderContainer bg="light">
            <Card.Title>
                Ready to find your match? Click the button below!
            </Card.Title>
            <Card.Body>
                <OverlayTrigger
                    placement="bottom"
                    overlay={buttonDisabled ? renderTooltip() : <></>}
                    delay={{ show: 250, hide: 600 }}
                >
                    <span>
                        <Button onClick={onMatchFind} variant='success' disabled={buttonDisabled}>Match!</Button>
                    </span>
                </OverlayTrigger>
            </Card.Body>
        </MatchFinderContainer>
    )
}

export default MatchFinder