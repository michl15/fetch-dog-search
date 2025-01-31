import React, { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import styled from "styled-components";

const FavoriteButton = styled(Button)`
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 100px;
`

const CardContainer = styled(Card)`
    width: ${props => props.compact ? '150px' : '300px'};
    height: 100%;
`

const DogCard = ({id, img, name, age, zipcode, breed, onClickFavorite, fave, compact=false}) => {
    const [favorited, setFavorited] = useState(fave);

    return (
        <CardContainer compact={compact}>
            <Card.Img style={{maxHeight:'400px'}}src={img}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                {!compact && <ListGroup>
                    <ListGroup.Item key="age">Age: {age}</ListGroup.Item>
                    <ListGroup.Item key="zip">Zipcode: {zipcode}</ListGroup.Item>
                    <ListGroup.Item key="breed">Breed: {breed}</ListGroup.Item>
                </ListGroup>}
                {!compact && <FavoriteButton size="sm" variant={favorited ? "danger" : "light"} onClick={() => {
                    onClickFavorite(id);
                    setFavorited(!favorited);
                }}>❤️</FavoriteButton>}
            </Card.Body>
        </CardContainer>
    )
}

export default DogCard;