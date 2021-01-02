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

const navBarLinks = [
    {
        path: '/',
        icon: <MdHome size="3x" />,
    },
    {
        path: '/playing',
        icon: <MdLibraryMusic size="3x" />,
    },
    {
        path: '/gallery',
        icon: <MdQueueMusic size="3x" />,
    },
    {
        path: '/settings',
        icon: <MdSettings size="3x" />,
    },
]

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
        const linkElements = navBarLinks.map((link) => {
            return (
                <Link to={link.path} key={link.path}>
                    <StyledNavBarButton>{link.icon}</StyledNavBarButton>
                </Link>
            )
        })

        return (
            <StyledNavBarContainer>
                <StyledNavBarContent>
                    {linkElements}
                    <FileSelector onSoundLoaded={() => {}} />
                </StyledNavBarContent>
            </StyledNavBarContainer>
        )
    }
}
