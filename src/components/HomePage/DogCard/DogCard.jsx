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
/**
 * Card with data about a dog
 * 
 * @param {string} dog - Dog object with data relating to the dog
 * @param {function} onClickFavorite - handler for clicking on the favorite button
 * @param {boolean} fave - initial state indicating if this dog is a favorite of the user
 * @param {boolean} compact - flag indicating if the card is in the panel. default is false
 * @returns DogCard component
 */
const DogCard = ({dog, onClickFavorite, fave, compact=false}) => {
    const [favorited, setFavorited] = useState(fave);

    return (
        <CardContainer $compact={compact}>
            <Card.Img style={{maxHeight:'400px'}}src={dog.img}/>
            <Card.Body>
                <Card.Title>{dog.name}</Card.Title>
                {!compact && <ListGroup>
                    <ListGroup.Item key="age">Age: {dog.age}</ListGroup.Item>
                    <ListGroup.Item key="zip">Zipcode: {dog.zipcode}</ListGroup.Item>
                    <ListGroup.Item key="breed">Breed: {dog.breed}</ListGroup.Item>
                </ListGroup>}
                {!compact && <FavoriteButton size="sm" variant={favorited ? "danger" : "light"} onClick={() => {
                    onClickFavorite(dog.id);
                    setFavorited(!favorited);
                }}>❤️</FavoriteButton>}
            </Card.Body>
        </CardContainer>
    )
}

export default DogCard;