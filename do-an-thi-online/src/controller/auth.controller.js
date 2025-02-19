import express from "express";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { User } from "../models/User.js";
import { encodeToken } from "../utils/jwt.js";

/** @type {express.RequestHandler} */
export const login = async (req, res) => {
    const {email, password} = req.body
    if(!email && !password){
        throw new Error('Invalid params')
    }
    const user = await User.findOne({where: {email}}).then(r => r?.toJSON())
    if(!user){
        throw new Error('User does not exist')
    }
    const validPassword = comparePassword(password, user.password);
    if(!validPassword){
        throw new Error('Invalid password')
    }
    const payload = {
        id: user.id,
        email: user.email
    }
    const token = encodeToken(payload)
    res.status(200).json({
        data: {
            token,
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        }
    })
};

/** @type {express.RequestHandler} */
export const register = async (req, res) => {
  /** @type {{name: string, email: string, password: string}} */
  const { name, email, password } = req.body;
  //validation
  if(!name && !email && !password){
    throw new Error('Invalid Params')
  }

  const existUser = await User.findOne({where: {email}}).then(r => r?.toJSON())
  
  if(existUser){
    throw new Error('User already exist')
  }
  const hashedPassword = hashPassword(password);
  const {password: hp, ...user} = await User.create({
    name,
    email,
    password: hashedPassword
  }).then(r => r.toJSON())

  res.status(200).json({
    success: true,
    data: {
        user
    }
  })
};

/** @type {express.RequestHandler} */
export const me = async (req, res) => {
    const userData = req['user']
    const u = await User.findOne({where: {id: userData.id}}).then(r => r?.toJSON())
    if(!u){
        throw new Error('Invalid User')
    }
    const {password, ...user} = u
    res.status(200).json({
        success: true,
        data: {
            user
        }
    })
}
