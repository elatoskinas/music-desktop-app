// React imports
import * as React from 'react'
import {
    StyledNavBarButton,
    StyledNavBarContainer,
    StyledNavBarContent,
} from './NavBar.styles'
import { Link } from 'react-router-dom'
import {
    MdHome,
    MdLibraryMusic,
    MdQueueMusic,
    MdSettings,
} from 'react-icons/md'
import { FileSelector } from './FileSelector'

/**
 * Main app navigation bar shown in most pages, giving access
 * to main functionality.
 */
export class NavBar extends React.Component<{}, {}> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <StyledNavBarContainer>
                <StyledNavBarContent>
                    <Link to="/">
                        <StyledNavBarButton>
                            <MdHome size="3x"></MdHome>
                        </StyledNavBarButton>
                    </Link>

                    <Link to="/playing">
                        <StyledNavBarButton>
                            <MdQueueMusic size="3x"></MdQueueMusic>
                        </StyledNavBarButton>
                    </Link>

                    <Link to="/gallery">
                        <StyledNavBarButton>
                            <MdLibraryMusic size="3x"></MdLibraryMusic>
                        </StyledNavBarButton>
                    </Link>

                    <Link to="/settings">
                        <StyledNavBarButton>
                            <MdSettings size="3x"></MdSettings>
                        </StyledNavBarButton>
                    </Link>

                    <FileSelector onSoundLoaded={() => {}} />
                </StyledNavBarContent>
            </StyledNavBarContainer>
        )
    }
}
