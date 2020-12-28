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
