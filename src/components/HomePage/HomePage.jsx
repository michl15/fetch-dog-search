import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_DOG_BREEDS, API_DOG_SEARCH, API_DOGS, API_DOGS_MATCH, API_LOGOUT_ENDPOINT } from "../../constants";
import Select from "react-select";
import { Button, CloseButton, Col, Container, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import DogCard from "../DogCard";
import styled from "styled-components";
import MatchFinder from "./MatchFinder/MatchFinder";
import MatchModal from "./MatchModal/MatchModal";
import { useNavigate } from "react-router";

const SearchBarContainer = styled.div`
    width: 70%;
    margin: auto;
    padding: 20px 0px;
    margin-bottom: 15px;
`

const SearchButton = styled(Button)`
    display: block;
    margin: 0 auto;
    margin-top: 20px;
`

const StyledCol = styled(Col)`
    margin: 15px 0;
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
    margin-bottom: 50px;
`
const Header = styled.div`
    width: 90%;
    margin: auto;
    margin-top: 15px;
    text-align: center;
`
const FavoritesButton = styled(Button)`
    position: fixed;
    left: 30px;
    z-index: 1;
    border-radius: 100px;
`

const PanelClose = styled(CloseButton)`
    position: absolute;
    left: 360px;
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

const ScrollToTopButton = styled(Button)`
    position: fixed;
    bottom: 10px;
    right: 20px;
    border-radius: 100px;
`

const LogoutButton = styled(Button)`
    position: absolute;
    right: 20px;
`

const SortResultsContainer = styled.div`
    text-align: center;
    width: 30%;
    margin: auto;
    margin-top: 10px;
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
    const [matchDisabled, setMatchDisabled] = useState(true);
    const [matchedDog, setMatchedDog] = useState({});
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [sortOrderAsc, setSortOrderAsc] = useState(true);

    const navigate = useNavigate();

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
            navigate("/")
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
        setIsLoading(true);
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
        const params = new URLSearchParams();
        selectedBreeds.forEach((val) => {
            params.append('breeds', val);
        });

        // get 24 at a time so that rows are even
        params.append('size', 24);
        params.append('sort', `breed:${sortOrderAsc ? 'asc' : 'desc'}`)
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
                    <StyledCol className="d-flex justify-content-center">
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
                            key={dog.id}
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
        setMatchDisabled(newFaves.length === 0);
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

    const onMatchFind = async () => {
        // call the match API
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log(favoritesIdList);

        const response = await fetch(API_DOGS_MATCH, {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: JSON.stringify(favoritesIdList)
        });

        const matchResponse = await response.json();

        // call the dog API to get back the selected dog
        const matchedDogResponse = await fetch(API_DOGS, {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: JSON.stringify([matchResponse.match])
        });

        const matchedDog = await matchedDogResponse.json();
        setMatchedDog(matchedDog[0]);
        setModalIsVisible(true);
    }

    const onScrollToTopClick = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    const onModalClose = () => {
        setModalIsVisible(false);
    }

    const onSortClick = (order) => {
        setSortOrderAsc(order);
    }

    const onClickLogout = async () => {
        const response = await fetch(API_LOGOUT_ENDPOINT, {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            //navigate to login
            navigate("/");
        }
            
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
            <FavoritesButton variant="primary" size="sm" onClick={onClickShowFavorites}>Favorites ❤️</FavoritesButton>
            <LogoutButton variant="primary" size="sm" onClick={onClickLogout}>Logout</LogoutButton>
            <Header>              
                <h1>Fetch!</h1>
                <p>Search for dogs by breed. Click the ❤️ on their photo to save them to your favorites, then hit Match to recieve a match!</p>
                <MatchFinder onMatchFind={onMatchFind} buttonDisabled={matchDisabled}/>
            </Header>
            <Offcanvas show={openPanel} onHide={closePanel}>
                <Offcanvas.Title>
                    <PanelHeader>Favorites</PanelHeader>
                </Offcanvas.Title>
                <PanelClose onClick={closePanel}/>
                <Offcanvas.Body>
                    {favoriteDogsList.length > 0 ? renderDogs(favoriteDogsList, true) : <span>You don't have any favorite dogs yet. Head to Search by Breed to start looking!</span>}
                </Offcanvas.Body>
            </Offcanvas>
            <MatchModal dog={matchedDog} isVisible={modalIsVisible} onClose={onModalClose}/>
            <SearchBarContainer>
                <h2>Search by breed</h2>
                <Select isMulti isSearchable isClearable form="" options={breedOptions} onChange={(e) => {breedsOnChange(e)}}/>
                <SortResultsContainer>
                    <h4>Sort Results</h4>
                    <Form>
                        <Form.Check
                            type='radio'
                            inline
                            id="asc-sort-check"
                            label="Ascending Alphabetical"
                            checked={sortOrderAsc}
                            onChange={() => {onSortClick(true)}}
                        >
                        </Form.Check>
                        <Form.Check
                            type='radio'
                            inline
                            id="des-sort-check"
                            label="Descending Alphabetical"
                            checked={!sortOrderAsc}
                            onChange={() => {onSortClick(false)}}
                        >
                        </Form.Check>
                    </Form>
                </SortResultsContainer>
                <SearchButton variant="primary" onClick={onSearch}>Search</SearchButton>
            </SearchBarContainer>
            {isLoading && 
                <LoadingSpinner>
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
            <ScrollToTopButton size="lg" onClick={onScrollToTopClick}>↑</ScrollToTopButton>
        </Container>
    );
}

export default HomePage;