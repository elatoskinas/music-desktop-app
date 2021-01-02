import React from 'react'

import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { PLAY_STATUS } from '@common/status.ts'
import { PlayButton } from '@frontend/MusicController'

import { Howl } from 'howler'
// import { Song } from '@data/music-data'

jest.mock('howler')

beforeEach(() => {
    ;(Howl as jest.Mock).mockClear()
})

test('Test play button click plays sound', async () => {
    // Create mock function to call on play sound
    let soundFunction = jest.fn()

    // Render component
    render(
        <PlayButton status={PLAY_STATUS.STOPPED} playSound={soundFunction} />
    )

    // Find button, perform click & wait for it to register
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => screen.getByRole('button'))

    // Assert that play sound callback has been invoked
    expect(soundFunction).toHaveBeenCalledTimes(1)
})

// /**
//  * Common sound tests that involve loading a sound before proceeding
//  * with testing.
//  */
// describe('Sound tests', () => {
//     let song = undefined
//     let rerenderController = undefined
//     let songEnded = jest.fn()

//     beforeEach(() => {
//         // Initialize undefined sound, and render music controller
//         const { rerender } = render(
//             <MusicController
//                 song={song}
//                 onSongEnded={songEnded}
//                 onPreviousSong={songEnded}
//                 onNextSong={songEnded}
//             />
//         )
//         rerenderController = rerender

//         // Create new sound & rerender component with updated sound
//         song = new Song().setPath('test/path.mp3')
//         rerenderController(
//             <MusicController
//                 song={song}
//                 onSongEnded={songEnded}
//                 onPreviousSong={songEnded}
//                 onNextSong={songEnded}
//             />
//         )
//     })

//     test('Test music controller sound change', () => {
//         // Assert that callbacks have been set
//         expect(song.on).toHaveBeenCalledWith('play', expect.any(Function))
//         expect(song.on).toHaveBeenCalledWith('stop', expect.any(Function))
//         expect(song.on).toHaveBeenCalledWith('pause', expect.any(Function))
//         expect(song.on).toHaveBeenCalledWith('end', expect.any(Function))
//         expect(song.on).toHaveBeenCalledWith('load', expect.any(Function))

//         // Assert that only 1 * 5 ccalls are made to sound on
//         expect(song.on).toHaveBeenCalledTimes(5)
//     })

//     test('Test play sound', async () => {
//         // Find play button, perform click & wait for it to register
//         fireEvent.click(screen.getByLabelText('Play Button'))
//         await waitFor(() => screen.getByLabelText('Play Button'))

//         expect(song.play).toBeCalledTimes(1)
//         expect(song.pause).toBeCalledTimes(0)
//     })

//     test('Test pause sound', async () => {
//         // Set sound to playing
//         song.playing.mockImplementation(() => true)

//         // Find play button, perform click & wait for it to register
//         fireEvent.click(screen.getByLabelText('Play Button'))
//         await waitFor(() => screen.getByLabelText('Play Button'))

//         expect(song.play).toBeCalledTimes(0)
//         expect(song.pause).toBeCalledTimes(1)
//     })

//     test('Test load new sound old stopped', () => {
//         // Store old sound reference
//         let oldSong = song

//         // Create new sound & rerender component with updated sound
//         song = new Song().setPath('path/to/test.mp3')
//         rerenderController(
//             <MusicController
//                 song={song}
//                 onSongEnded={songEnded}
//                 onPreviousSong={songEnded}
//                 onNextSong={songEnded}
//             />
//         )

//         // Assert that old sound is stopped, and callbacks are removed
//         expect(oldSong.stop).toHaveBeenCalled()
//         expect(oldSong.off).toHaveBeenCalled()
//     })

//     test('Test play no sound', async () => {
//         // Restore music controller to original state with no sound
//         rerenderController(
//             <MusicController
//                 song={undefined}
//                 onSongEnded={songEnded}
//                 onPreviousSong={songEnded}
//                 onNextSong={songEnded}
//             />
//         )

//         // Find play button, perform click & wait for it to register
//         fireEvent.click(screen.getByLabelText('Play Button'))
//         await waitFor(() => screen.getByLabelText('Play Button'))

//         // Test will pass if no exception is thrown
//     })
// })
