import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
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

    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 2000)
    }, [navigate]);

    return (
        <PageContainer>
            <Alert variant="danger">
                <h1>Error</h1>
                <h4>An unexpected error has occurred. Redirecting you to the login screen...</h4>
            </Alert>
        </PageContainer>
    )
}

export default ErrorPage;