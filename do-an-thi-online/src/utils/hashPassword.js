import bcrypt from 'bcrypt'
const salfRounds = 10 
export const hashPassword = (pass) => bcrypt.hashSync(pass, salfRounds)

export const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword)