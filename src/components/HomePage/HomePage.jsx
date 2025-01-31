import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_DOG_BREEDS, API_DOG_SEARCH, API_DOGS, API_DOGS_MATCH, API_LOGOUT_ENDPOINT } from "../../constants";
import Select from "react-select";
import { Button, CloseButton, Col, Collapse, Container, Fade, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import DogCard from "./DogCard";
import styled from "styled-components";
import MatchModal from "./MatchModal";
import { useNavigate } from "react-router";
import MatchFinder from "./MatchFinder";

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
    left: 20px;
    z-index: 1;
    max-height: 48px;
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
    width: 100%;
    margin: auto;
    margin-top: 10px;
`
/**
 * Component which holds states of query results, makes API calls, and displays the main UX
 * 
 * @returns HomePage component
 */
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
    const [isAtTop, setIsAtTop] = useState(true);

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
            navigate("/error")
        }
    }

    // onChange function for Select component
    const breedsOnChange = (event) => {
        // reformat the list for API request body
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

    // Takes url and runs API request to get list of dog IDs from search params
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
        // create the params for the URL
        const params = new URLSearchParams();
        selectedBreeds.forEach((val) => {
            params.append('breeds', val);
        });

        // get 24 at a time so that rows are even
        params.append('size', 24);
        // check state for ascending/descending order
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

    // handler for next
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
            <Row key="dogRow">
            {
                dogs.map((dog) => {
                    return (
                    <StyledCol className="d-flex justify-content-center" key={dog.id}>
                        <DogCard
                            dog={dog}
                            onClickFavorite={onClickFavorite}
                            favoritesList={favoritesIdList}
                            compact={compact}
                            onClickDelete={onClickDelete}
                        />
                    </StyledCol>
                    )
                })
            }
            </Row>
        )
    }

    // handler for clicking "Favorite" on a dog
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

    // handler for clicking "Favorite" on a dog
    const onClickDelete = (id) => {
        let newFaves;
        let newFavesIds;
        if (favoritesIdList.includes(id)) {
            // remove from favorites if already selected
            newFaves = favoriteDogsList.filter(fave => fave.id !== id);
            newFavesIds = favoritesIdList.filter(fave => fave !== id);
        } 
        setFavoriteDogsList(newFaves);
        setFavoritesIdList(newFavesIds);
        setMatchDisabled(newFaves?.length === 0);
    }

    // handler to open the panel and display the favorite dogs
    const onClickShowFavorites = async () => {
        setOpenPanel(true);
        const response = await queryDogs(favoritesIdList);

        const newFavoriteDogs = await response.json();
        setFavoriteDogsList(newFavoriteDogs);
    }

    const closePanel = () => {
        setOpenPanel(false);
    }

    // handler for clicking on "Match" button
    const onMatchFind = async () => {
        // call the match API with favorites
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(API_DOGS_MATCH, {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: JSON.stringify(favoritesIdList)
        });

        // string ID of dog
        const matchResponse = await response.json();

        // call the dog API to get back data for the selected dog
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

    // handler for scrolling back to top
    const onScrollToTopClick = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    // handler for closing modal
    const onModalClose = () => {
        setModalIsVisible(false);
    }

    // handler for setting the sort order
    const onSortClick = (order) => {
        setSortOrderAsc(order);
    }

    // handler for clicking on "Logout"
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

    useEffect(() => {
        // track if user is at top of the page for conditional rendering
        const handleScroll = () => {
          setIsAtTop(window.scrollY < 500);
        };
    
        window.addEventListener('scroll', handleScroll);    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (
        <Container>
            <Collapse in={isAtTop} dimension="width">
                <FavoritesButton variant="danger" size="md" onClick={onClickShowFavorites}>Favorites</FavoritesButton>
            </Collapse>
            <Fade in={!isAtTop}>
                <FavoritesButton variant="danger" size="md" onClick={onClickShowFavorites}>❤️</FavoritesButton>
            </Fade>
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
            {!isLoading &&
            <>
                {renderDogs(dogList, false)}
                <Footer>
                    <Col>
                        {prevEnabled && <PrevButton onClick={onClickPrev} variant='outline-primary'>« Prev</PrevButton>}    
                    </Col>
                    <Col>
                        {nextEnabled && <NextButton onClick={onClickNext} variant='outline-primary'>Next »</NextButton>}  
                    </Col>
                </Footer>
            </>
            }
            <Fade in={!isAtTop}>
                <ScrollToTopButton size="lg" onClick={onScrollToTopClick}>↑</ScrollToTopButton>
            </Fade>
        </Container>
    );
}

export default HomePage;