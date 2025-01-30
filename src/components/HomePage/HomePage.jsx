import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_DOG_BREEDS, API_DOG_SEARCH, API_DOGS } from "../../constants";
import Select from "react-select";
import { Button, Col, Container, Row } from "react-bootstrap";
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

const HomePage = () => {
    const [breedOptions, setBreedOptions] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [dogList, setDogList] = useState([]);
    const [queryResult, setQueryResult] = useState({});
    const [prevEnabled, setPrevEnabled] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    // retrieve dogs using list of IDs
    const getDogs = async (dogInfoList) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const dogsResponse = await fetch(API_DOGS, {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: JSON.stringify(dogInfoList)
        });

        const newDogList = await dogsResponse.json();
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
        console.log(result);
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
    const renderDogs = () => {
        return (
            <Row>
            {
                dogList.map((dog) => {
                    
                    return (
                    <StyledCol>
                        <DogCard
                            img={dog.img}
                            name={dog.name}
                            age={dog.age}
                            zipcode={dog.zip_code}
                            breed={dog.breed}
                        />
                    </StyledCol>
                    )
                })
            }
            </Row>
        )
    }

    useEffect(() => {
        // get the list of breeds on initial render
        getBreedsList();
    }, [])


    return (
        <Container>
            <SearchBarContainer>
                <h1>Fetch!</h1>
                <h2>Search by breed</h2>
                <Select isMulti isSearchable isClearable form="" options={breedOptions} onChange={(e) => {breedsOnChange(e)}}/>
                <SearchButton variant="primary" onClick={onSearch}>Search</SearchButton>
            </SearchBarContainer>
            {!isLoading && renderDogs()}
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