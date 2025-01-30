import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { API_LOGIN_ENDPOINT } from "../../constants";
import { useNavigate } from "react-router";

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

        if (response.status === 200) {
            //navigate to home
            navigate("/home");
        } else {
            // display error message
        }
    }

    return (
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

            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Form>
    )
}

export default LoginPage;