/**
 * 
 * @param {string} name 
 * @returns 
 */
export const envToBoolean = (name) => {
    const v = (process.env[name] || '').toLowerCase()
    return v === '1' || v === 'true' || v === 'yes'
  }