import * as formatUtils from '@common/format-utils'

test.each([
    [undefined, '?:??'],
    [null, '?:??'],
    [0, '0:00'],
    [5, '0:05'],
    [45, '0:45'],
    [60, '1:00'],
    [61, '1:01'],
    [91, '1:31'],
    [234, '3:54'],
    [1623, '27:03'],
    [10050, '167:30'],
])('Format timestamp of %d', (time: number, expected: string) => {
    const result = formatUtils.formatTimestamp(time)
    expect(result).toBe(expected)
})

test.each([
    [undefined, []],
    [null, []],
    ['artist', ['artist']],
    ['Artist With Spaces', ['Artist With Spaces']],
    ['Artist1;Artist2;Artist3', ['Artist1', 'Artist2', 'Artist3']],
    ['Artist1; Artist2; Artist3', ['Artist1', 'Artist2', 'Artist3']],
    ['Artist1;', ['Artist1', '']],
    ['  Artist  ', ['Artist']],
    [
        'Artist With Space;Another Artist;  Artist1',
        ['Artist With Space', 'Another Artist', 'Artist1'],
    ],
])('Split artists of %s', (artist: string, expected: string[]) => {
    const result = formatUtils.splitArtists(artist)
    expect(result).toEqual(expected)
})
