import React from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import styled from "styled-components";

const PageContainer = styled.div`
    width: 70%;
    margin: auto;
    margin-top: 40px;
`

/**
 * Error page which redirects to login - just here to indicate to user that an error has occurred
 * @returns ErrorPage component
 */
const ErrorPage = () => {
    const navigate = useNavigate();

    const onReturnClick = () => {
        navigate('/');
    }

    return (
        <PageContainer>
            <Alert variant="danger">
                <h1>Error</h1>
                <p>An unexpected error has occurred.</p>
                <Button onClick={onReturnClick} variant="danger">Return to Login</Button>
            </Alert>
        </PageContainer>
    )
}

export default ErrorPage;