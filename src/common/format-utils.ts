/**
 * Formats the specified number into a string of format hh:mm:ss
 * 
 * TODO: Exclude hours/mins if n/a
 * 
 * @param time  Time as number to format
 */
export function formatTimestamp(time: number) {
    time = Math.floor(time)
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60

    const secondsString = seconds < 10 ? `0${seconds}` : seconds

    return `${minutes}:${secondsString}`
}