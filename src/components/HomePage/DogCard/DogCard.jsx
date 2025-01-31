import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import styled from "styled-components";

const FavoriteButton = styled(Button)`
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 50%;
`

const DeleteButton = styled(Button)`
    position: absolute;
    right: -15px;
    top: -15px;
    border-radius: 50%;
    width: 31px;
`

const CardContainer = styled(Card)`
    width: ${props => props.$compact ? '150px' : '300px'};
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
const DogCard = ({dog, onClickFavorite, favoritesList, compact=false, onClickDelete}) => {
    const [favorited, setFavorited] = useState(false);

    useEffect(() => {
        // need to check the favorites list to unmark favorites when they are deleted from the list
        setFavorited(favoritesList.includes(dog.id));
    }, [dog.id, favoritesList]);

    return (
        <CardContainer $compact={compact}>
            <Card.Img style={{maxHeight:'400px'}}src={dog.img}/>
            <Card.Body>
                <Card.Title>{dog.name}</Card.Title>
                {!compact && 
                <>
                    <ListGroup variant="flush">
                        <ListGroup.Item key="age">Age: {dog.age}</ListGroup.Item>
                        <ListGroup.Item key="zip">Zipcode: {dog.zip_code}</ListGroup.Item>
                        <ListGroup.Item key="breed">Breed: {dog.breed}</ListGroup.Item>
                    </ListGroup>
                    <FavoriteButton size="sm" variant={favorited ? "danger" : "light"} onClick={() => {
                        onClickFavorite(dog.id);
                    }}>❤️</FavoriteButton>
                </>}
                {compact && <DeleteButton variant="dark" size="sm" onClick={() => {
                    onClickDelete(dog.id);
                }}>X</DeleteButton>}
            </Card.Body>
        </CardContainer>
    )
}

export default DogCard;