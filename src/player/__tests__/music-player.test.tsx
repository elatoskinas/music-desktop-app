import React from 'react'

import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { PlayButton, MusicController } from '@player/music-player.tsx'
import { PLAY_STATUS } from '@common/status.ts'

import { Howl } from 'howler'
jest.mock('howler')

beforeEach(() => {
    (Howl as jest.Mock).mockClear()
})

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

/**
 * Common sound tests that involve loading a sound before proceeding
 * with testing.
 */
describe('Sound tests', () => {
    let sound = undefined
    let rerenderController = undefined

    beforeEach(() => {
        // Initialize undefined sound, and render music controller
        const { rerender } = render(<MusicController sound={sound}/>)
        rerenderController = rerender

        // Create new sound & rerender component with updated sound
        sound = new Howl(null)
        rerenderController(<MusicController sound={sound} />)
    })

    test('Test music controller sound change', () => {
        // Assert that callbacks have been set
        expect(sound.on).toHaveBeenCalledWith('play', expect.any(Function))
        expect(sound.on).toHaveBeenCalledWith('stop', expect.any(Function))
        expect(sound.on).toHaveBeenCalledWith('pause', expect.any(Function))
        expect(sound.on).toHaveBeenCalledWith('end', expect.any(Function))
        expect(sound.on).toHaveBeenCalledWith('load', expect.any(Function))
    
        // Assert that only 1 * 5 ccalls are made to sound on
        expect(sound.on).toHaveBeenCalledTimes(5)
    })
    
    test('Test play sound', async () => {    
            // Find play button, perform click & wait for it to register
            fireEvent.click(screen.getByLabelText('Play Button'))
            await waitFor(() => screen.getByLabelText('Play Button'))
    
            expect(sound.play).toBeCalledTimes(1)
            expect(sound.pause).toBeCalledTimes(0)
    })

    test('Test pause sound', async () => {
        // Set sound to playing
        sound.playing.mockImplementation(() => true)

        // Find play button, perform click & wait for it to register
        fireEvent.click(screen.getByLabelText('Play Button'))
        await waitFor(() => screen.getByLabelText('Play Button'))

        expect(sound.play).toBeCalledTimes(0)
        expect(sound.pause).toBeCalledTimes(1)
    })

    test('Test load new sound old stopped', () => {
        // Store old sound reference
        let oldSound = sound

        // Create new sound & rerender component with updated sound
        sound = new Howl(null)
        rerenderController(<MusicController sound={sound} />)

        // Assert that old sound is stopped, and callbacks are removed
        expect(oldSound.stop).toHaveBeenCalled()
        expect(oldSound.off).toHaveBeenCalled()
    })

    test('Test play no sound', async () => {
        // Restore music controller to original state with no sound
        rerenderController(<MusicController sound={undefined} />)

        // Find play button, perform click & wait for it to register
        fireEvent.click(screen.getByLabelText('Play Button'))
        await waitFor(() => screen.getByLabelText('Play Button'))

        // Test will pass if no exception is thrown
    })
})