import { User } from "../models/User.js"


export const checkUserAdmin = async (id) =>{
  const existUser = await User.findOne({where: {id}}).then(r => r?.toJSON())
  if (existUser.isAdmin) {
    return true
  }
  return false
}