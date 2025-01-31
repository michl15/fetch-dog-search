import React from "react";
import styled from "styled-components";
import { GITHUB_LINK, GITHUB_LOGO_SRC } from "../../constants";

const FooterContainer = styled.div`
    position: fixed;
    bottom: 30px;
    width: 100%;
    height: 50px;
    text-align: center;
`

const StyledImage = styled.img`
    height: 100%;
`

const StyledText = styled.span`
    font-size: 13px;
`

const PageFooter = () => {
    return (
        <FooterContainer>
            <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
                <StyledImage src={GITHUB_LOGO_SRC} alt='github logo'/>
            </a>
            <br/>
            <StyledText>Check out the source code on Github!</StyledText>
        </FooterContainer>
    )
}

export default PageFooter;