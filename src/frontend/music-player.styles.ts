import styled from '@emotion/styled'

export const StyledMusicControlButton = styled.button`
    border-radius: 100%;
    background-color: none;
    text-decoration: none;
    height: 48px;
    width: 48px;
    margin: 0 5px;
    border-color: #000000;
    border-width: 1.5px;
    transition: ease 0.1s;
    outline: none;

    :hover {
        background-color: #e4e4e4c6;
    }

    :active {
        background-color: #ffffffc6;
        border-color: #f0f0f0;
    }    
`

export const StyledMusicControlContainer = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
`
