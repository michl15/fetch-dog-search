import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { API_LOGIN_ENDPOINT } from "../../constants";
import { useNavigate } from "react-router";
import styled from "styled-components";

const LoginContainer = styled.div`
    width: 50%;
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

const LoginPage = () => {
    // store input values for login
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);

    const navigate = useNavigate();

    // Handler for login
    const handleSubmit = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
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
        } catch (e) {
            setShowErrorAlert(true);
        }
    }

    const emailValidation = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setIsEmailValid(emailPattern.test(email));
        setFormValid(isEmailValid && isNameValid);
    }

    const nameValidation = (name) => {
        setIsNameValid(name.trim().length > 0);
        setFormValid(isEmailValid && isNameValid);
    }

    return (
        <LoginContainer>
            <StyledHeader>
                <h1>Welcome to Fetch!</h1>
                <h2>Please sign in</h2>
            </StyledHeader>
            <Form>
                <StyledFormInput controlId="formEmail">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control placeholder="Enter your email" onChange={(e) => { 
                        emailValidation(e.target.value);
                        setEmail(e.target.value);
                    }}/>
                    {!isEmailValid && <ValidationMessage>Please enter a valid email</ValidationMessage>}
                </StyledFormInput>
                <StyledFormInput controlId="formName">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control placeholder="Enter your name" onChange={(e) => {
                        nameValidation(e.target.value);
                        setName(e.target.value);
                    }}/>
                    {!isNameValid && <ValidationMessage>Please enter a name</ValidationMessage>}
                </StyledFormInput>

                <SubmitButton variant="primary" onClick={handleSubmit} disabled={!formValid}>
                    Submit
                </SubmitButton>
            </Form>
            <Alert variant="danger" show={showErrorAlert} onClose={() => {
                setShowErrorAlert(false);
            }} dismissible>An error has occured, please try to login again</Alert>
        </LoginContainer>
    )
}

export default LoginPage;