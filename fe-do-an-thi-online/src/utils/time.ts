const milisecond = 1
const second = milisecond * 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

type Time = 'milisecond' | 'second' | 'minute' | 'hour' | 'day'
const time: { [K in Time]: number } = {
  milisecond,
  second,
  minute,
  hour,
  day,
}
/**
 *
 * @param n time unit number
 * @param type unit
 * @returns Convert from the specifical time to milisecond
 * n: 1
 * type: hour
 * Result: 3600000
 */
export const getMilisecond = (n: number, type: Time) => n * time[type]
/**
 *
 * @param n The time unit number
 * @param type unit
 * @returns Convert from the specifical time to second
 * n: 1
 * type: hour
 * Result: 3600
 */
export const getSecond = (n: number, type: Time) => (n * time[type]) / second

/**
 *
 * @param n The time unit number
 * @param type unit
 * @returns Convert from the specifical time to minute
 * n: 1
 * type: hour
 * Result: 60
 */
export const getMinute = (n: number, type: Time) => (n * time[type]) / minute

/**
 *
 * @param n The time unit number
 * @param type unit
 * @returns Convert from the specifical time to hour
 * n: 1
 * type: hour
 * Result: 1
 */
export const getHour = (n: number, type: Time) => (n * time[type]) / hour