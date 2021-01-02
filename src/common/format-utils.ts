/**
 * Formats the specified number into a string of format hh:mm:ss
 *
 * TODO: Exclude hours/mins if n/a
 *
 * @param time  Time as number to format
 */
export function formatTimestamp(time: number) {
    if (time === undefined || time === null) {
        return '?:??'
    }

    time = Math.floor(time)
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60

    const secondsString = seconds < 10 ? `0${seconds}` : seconds

    return `${minutes}:${secondsString}`
}

/**
 * Escape regex string literal by replacing special regexp symbols with
 * escaped counterparts.
 *
 * @param text String literal to escape
 */
export function escapeRegex(text: string): string {
    return text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Splits an artist tag into a list of artists by the ';' character
 *
 * @param artist Artist tag
 */
export function splitArtists(artist: string): string[] {
    if (!artist) {
        return []
    }

    return artist.split(';').map((artist) => {
        return artist.trim()
    })
}
