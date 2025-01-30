import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { API_LOGIN_ENDPOINT } from "../../constants";
import { useNavigate } from "react-router";
import styled from "styled-components";

const LoginContainer = styled.div`
    width: 30%;
    margin: auto;
    margin-top: 10px;
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
`

const LoginPage = () => {
    // store input values for login
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    // Handler for login
    const handleSubmit = async () => {
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
        } else {
            // display error message
        }
    }

    return (
        <LoginContainer>
            <StyledHeader>
                <h1>Welcome to Fetch!</h1>
                <h2>Please sign in</h2>
            </StyledHeader>
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control placeholder="Enter your email" onChange={(e) => {
                        setEmail(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Enter your name" onChange={(e) => {
                        setName(e.target.value);
                    }}/>
                </Form.Group>

                <SubmitButton variant="primary" onClick={handleSubmit}>
                    Submit
                </SubmitButton>
            </Form>
        </LoginContainer>
    )
}

export default LoginPage;