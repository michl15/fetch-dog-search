import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import styled from "styled-components";

const CardContainer = styled(Card)`
    width: 300px;
    height: 100%;
`

const FavoriteButton = styled(Button)`
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 100px;
`

const DogCard = ({img, name, age, zipcode, breed}) => {
    return (
        <CardContainer>
            <Card.Img src={img}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    <ListGroup>
                        <ListGroup.Item>Age: {age}</ListGroup.Item>
                        <ListGroup.Item>Zipcode: {zipcode}</ListGroup.Item>
                        <ListGroup.Item>Breed: {breed}</ListGroup.Item>
                    </ListGroup>
                    <FavoriteButton variant="light">❤️</FavoriteButton>
                </Card.Text>
            </Card.Body>
        </CardContainer>
    )
}

export default DogCard;