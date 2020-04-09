import React from 'react'


import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const { PlayButton, MusicController } = require('@player/music-player.tsx')
const {PLAY_STATUS} = require('@common/status.ts')

const fileLoader = require('@player/music-player.tsx')

test('test', async () => {
    render(<PlayButton status={PLAY_STATUS.STOPPED} />)
})