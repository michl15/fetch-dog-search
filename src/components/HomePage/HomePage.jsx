import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_DOG_BREEDS, API_DOG_SEARCH, API_DOGS } from "../../constants";
import Select from "react-select";
import { Button, CloseButton, Col, Container, Offcanvas, Row, Spinner } from "react-bootstrap";
import DogCard from "../DogCard";
import styled from "styled-components";

const SearchBarContainer = styled.div`
    width: 70%;
    margin: auto;
    padding: 20px 0px;
`

const SearchButton = styled(Button)`
    display: block;
    margin: 0 auto;
    margin-top: 20px;
`

const StyledCol = styled(Col)`
    padding: 20px 10px;
`

const NextButton = styled(Button)`
    float: right;
`

const PrevButton = styled(Button)`
    float: left;
`

const Footer = styled(Row)`
    margin: auto;
    padding: 10px;
    margin-botton: 50px;
`
const Header = styled.div`
    margin: 30px 10px;
    text-align: center;
    width: 100%;
`
const FavoritesButton = styled(Button)`
    position: fixed;
    right: 20px;
`

const PanelClose = styled(CloseButton)`
    position: fixed;
    right: 10px;
    top: 15px;
`
const LoadingSpinner = styled(Spinner)`
    display: block;
    margin: 0 auto;
    margin-top: 20px;
`
const PanelHeader = styled.h2`
    background-color: lightgray;
    text-align: center;
    padding: 10px;
`

const HomePage = () => {
    const [breedOptions, setBreedOptions] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [dogList, setDogList] = useState([]);
    const [queryResult, setQueryResult] = useState({});
    const [prevEnabled, setPrevEnabled] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [favoritesIdList, setFavoritesIdList] = useState([]);
    const [favoriteDogsList, setFavoriteDogsList] = useState([]);
    const [openPanel, setOpenPanel] = useState(false);

    const getBreedsList = async () => {
        // fetch request to get all possible breeds
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const breedsResponse = await fetch(API_DOG_BREEDS, {
            method: "GET",
            credentials: "include",
            headers: myHeaders
        });

        // format response for Select component
        if (breedsResponse.ok) {
            const breedsList = await breedsResponse.json()

            const breedOpts = breedsList.map((breed) => {
                return {value: breed, label: breed}
            });
            setBreedOptions(breedOpts);
        } else {
            // nav back to login
        }
    }

    // onChange function for Select component
    const breedsOnChange = (event) => {
        const formattedList = event.map((obj) => {
            return obj.label;
        })
        setSelectedBreeds(formattedList);
    }

    //helper function to call API
    const queryDogs = async (dogInfoList) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        return await fetch(API_DOGS, {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: JSON.stringify(dogInfoList)
        });
    }

    // retrieve dogs using list of IDs
    const getDogs = async (dogInfoList) => {
        const response = await queryDogs(dogInfoList);

        const newDogList = await response.json();
        setDogList(newDogList);
        setIsLoading(false);
    }

    const searchQuery = async (url) => {
        setDogList([]);
        setPrevEnabled(false);
        setNextEnabled(false);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: myHeaders
        });

        const result = await response.json();
        setNextEnabled(result.next);
        setPrevEnabled(result.prev);
        setQueryResult(result);
        getDogs(result.resultIds);
    }

    // handler for clicking search function
    const onSearch = () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        selectedBreeds.forEach((val) => {
            params.append('breeds', val);
        });

        // get 24 at a time so that rows are even
        params.append('size', 24);
        const fetchURL = `${API_DOG_SEARCH}?${params}`
        searchQuery(fetchURL);
    }

    // handler for prev
    const onClickPrev = () => {
        if (queryResult.prev) {
            const fetchURL = `${API_BASE_URL}${queryResult.prev}`;
            searchQuery(fetchURL);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    }

    // handler for prev
    const onClickNext = () => {
        if (queryResult.next) {
            const fetchURL = `${API_BASE_URL}${queryResult.next}`;
            searchQuery(fetchURL);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    }
    // helper function to render all dogs returned by search
    const renderDogs = (dogs, compact) => {
        return (
            <Row>
            {
                dogs.map((dog) => {
                    return (
                    <StyledCol>
                        <DogCard
                            id={dog.id}
                            img={dog.img}
                            name={dog.name}
                            age={dog.age}
                            zipcode={dog.zip_code}
                            breed={dog.breed}
                            onClickFavorite={onClickFavorite}
                            fave={favoritesIdList.includes(dog.id)}
                            compact={compact}
                        />
                    </StyledCol>
                    )
                })
            }
            </Row>
        )
    }

    const onClickFavorite = (id) => {
        let newFaves;
        if (favoritesIdList.includes(id)) {
            // remove from favorites if already selected
            newFaves = favoritesIdList.filter(fave => fave !== id);
        } else {
            // add to favorites if not selected
            newFaves = [...favoritesIdList, id];
        }
        setFavoritesIdList(newFaves);
        console.log(newFaves);
    }

    const onClickShowFavorites = async () => {
        setOpenPanel(true);
        const response = await queryDogs(favoritesIdList);

        const newFavoriteDogs = await response.json();
        setFavoriteDogsList(newFavoriteDogs);
    }

    const closePanel = () => {
        setOpenPanel(false);
    }

    useEffect(() => {
        // get the list of breeds on initial render
        getBreedsList();
        // initial search to populate homepage
        onSearch();
         // eslint-disable-next-line
    }, []);


    return (
        <Container>
            <Header>
                <FavoritesButton onClick={onClickShowFavorites}>Favorites ❤️</FavoritesButton>
                <h1>Fetch!</h1>
                <p>Search for dogs by breed. Click the ❤️ on their photo to save them to your favorites, then hit Match to recieve a match!</p>

            </Header>
            <Offcanvas show={openPanel} onHide={closePanel} placement="end">
                <Offcanvas.Title>
                    <PanelHeader>Favorites</PanelHeader>
                </Offcanvas.Title>
                <PanelClose onClick={closePanel}/>
                <Offcanvas.Body>
                    {favoriteDogsList.length > 0 ? renderDogs(favoriteDogsList, true) : <span>You don't have any favorite dogs yet. Head to Search by Breed to start looking!</span>}
                </Offcanvas.Body>
                
            </Offcanvas>
            <SearchBarContainer>
                <h2>Search by breed</h2>
                <Select isMulti isSearchable isClearable form="" options={breedOptions} onChange={(e) => {breedsOnChange(e)}}/>
                <SearchButton variant="primary" onClick={onSearch}>Search</SearchButton>
            </SearchBarContainer>
            {isLoading && <LoadingSpinner>
                    <span className="visually-hidden">Loading...</span>
                </LoadingSpinner>}
            {!isLoading && renderDogs(dogList, false)}
            {!isLoading &&
            <Footer>
                <Col>
                    {prevEnabled && <PrevButton onClick={onClickPrev}>« Prev</PrevButton>}    
                </Col>
                <Col>
                    {nextEnabled && <NextButton onClick={onClickNext}>Next »</NextButton>}  
                </Col>
            </Footer>
            }
        </Container>
    );
}

export default HomePage;