import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { API_LOGIN_ENDPOINT, FETCH_LOGO_SRC } from "../../constants";
import { useNavigate } from "react-router";
import styled from "styled-components";
import PageFooter from "../PageFooter";

const LoginContainer = styled.div`
    max-width: 70%;
    width: 500px;
    margin: auto;
    margin-top: 50px;
    padding: 25px 50px;
    border: 1px solid lightgray;
    border-radius: 15px;
`
const StyledHeader = styled.div`
    text-align: center;
`
const SubmitButton = styled(Button)`
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
`
const StyledFormInput = styled(Form.Group)`
    margin-bottom: 10px;
`
const ValidationMessage = styled.p`
    color: red;
    font-size: 12px;
`

const StyledImage = styled.img`
    height: 250px;
    margin: 20px 0px;
`

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);

    const navigate = useNavigate();

    // Handler for login
    const handleSubmit = async () => {
        setIsEmailValid(emailValidation());
        setIsNameValid(nameValidation())
        if (emailValidation()&& nameValidation()) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const response = await fetch(API_LOGIN_ENDPOINT, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({name: name, email: email}),
                headers: myHeaders
            });

            if (response.ok) {
                //navigate to home
                navigate("/home");
            }
            setShowErrorAlert(true);
        }
        
    }

    // Check if email is valid
    const emailValidation = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    // check if name is not empty
    const nameValidation = () => {
        return name.trim().length > 0;
    }

    return (
        <>
        <LoginContainer>
            <StyledHeader>
                <h1>Welcome to Fetch!</h1>
                <StyledImage src={FETCH_LOGO_SRC} alt="logo"/>
                <h2>Please sign in</h2>
            </StyledHeader>
            <Form>
                <StyledFormInput controlId="formEmail">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control placeholder="Enter your email" onChange={(e) => { 
                        setEmail(e.target.value);
                    }}/>
                    {!isEmailValid && <ValidationMessage>Please enter a valid email</ValidationMessage>}
                </StyledFormInput>
                <StyledFormInput controlId="formName">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control placeholder="Enter your name" onChange={(e) => {
                        setName(e.target.value);
                    }}/>
                    {!isNameValid && <ValidationMessage>Please enter a name</ValidationMessage>}
                </StyledFormInput>

                <SubmitButton variant="primary" onClick={handleSubmit}>
                    Submit
                </SubmitButton>
            </Form>
            <Alert variant="danger" show={showErrorAlert} onClose={() => {
                setShowErrorAlert(false);
            }} dismissible>An error has occured, please try to login again</Alert>
        </LoginContainer>
        <PageFooter/>
        </>
    )
}

export default LoginPage;