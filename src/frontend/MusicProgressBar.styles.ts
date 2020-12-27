import styled from '@emotion/styled'
import { THEME_COLOURS } from './common-styles'

export type StyledProgressBarProps = {
    /** Percentage of progress bar completion */
    progressPercent: number
}

const progressFilledColor = '#48a4ff'

export const StyledProgressBar = styled.input`
    width: 100%;
    height: 8px;

    -webkit-appearance: none;
    outline: none;

    border-radius: 2px;

    background: linear-gradient(
        to right,
        ${progressFilledColor} 0%,
        ${progressFilledColor}
            ${(props: StyledProgressBarProps) => props.progressPercent}%,
        ${THEME_COLOURS.accentDark}
            ${(props: StyledProgressBarProps) => props.progressPercent}%,
        ${THEME_COLOURS.accentDark} 100%
    );

    ::-webkit-slider-thumb {
        width: 15px;
        height: 15px;

        -webkit-appearance: none;
        background-color: ${THEME_COLOURS.primary};

        border-radius: 100%;
        border-style: solid;
        border-color: ${progressFilledColor};
        border-width: 2px;
        transition: ease 0.2s;
    }

    ::-webkit-slider-thumb:hover {
        background-color: #7abcff;
    }

    ::-webkit-slider-thumb:active {
        background-color: ${progressFilledColor};
    }
`

export const StyledProgressTimeContainer = styled.div`
    display: flex;
    justify-content: space-between;
`
