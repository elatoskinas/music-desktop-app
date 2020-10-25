import styled from '@emotion/styled'

export type StyledProgressBarProps = {
    progressPercent: number
}

export const StyledProgressBar = styled.input`
    width: 100%;
    height: 8px;

    -webkit-appearance: none;
    outline: none;

    border-radius: 2px;

    background: linear-gradient(to right, #48a4ff 0%,
        #48a4ff ${(props: StyledProgressBarProps) => props.progressPercent}%,
        #d3d3d3 ${(props: StyledProgressBarProps) => props.progressPercent}%,
        #d3d3d3 100%);

    ::-webkit-slider-thumb {
        width: 15px;
        height: 15px;
    
        -webkit-appearance: none;
        background-color: #f3f3f3;
    
        border-radius: 100%;
        border-style: solid;
        border-color: #48a4ff;
        border-width: 2px;
        transition: ease .2s;
    }

    ::-webkit-slider-thumb:hover {
        background-color: #7abcff;
    }
    
    ::-webkit-slider-thumb:active {
        background-color: #48a4ff;
    }
`
