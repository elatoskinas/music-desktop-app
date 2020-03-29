/**
 * Formats the specified number into a string of format hh:mm:ss
 * 
 * TODO: Exclude hours/mins if n/a
 * 
 * @param time  Time as number to format
 */
export function formatTimestamp(time: number) {
    return new Date(time * 1000).toISOString().substr(11, 8)
}