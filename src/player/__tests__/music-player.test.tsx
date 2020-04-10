import React from 'react'


import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const { PlayButton, MusicController } = require('@player/music-player.tsx')
const { PLAY_STATUS } = require('@common/status.ts')

const fileLoader = require('@player/music-player.tsx')

test('Test play button click plays sound', async () => {
    // Create mock function to call on play sound
    let soundFunction = jest.fn()

    // Render component
    render(<PlayButton status={PLAY_STATUS.STOPPED} playSound={soundFunction} />)

    // Find button, perform click & wait for it to register
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => screen.getByRole('button'))

    // Assert that play sound callback has been invoked
    expect(soundFunction).toHaveBeenCalledTimes(1)
})