import jwt from 'jsonwebtoken'
import { config } from '../../config/config'
import { Response } from 'express'

export const generateToken = (res: Response, id: string) => {
  //generate token
  const token = jwt.sign({ userId: id }, config.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  })
  //store token in cookie
  res.cookie('auth-token', token, {
    maxAge: 24 * 60 * 60 * 1000, //1day
    httpOnly: true,
    secure: config.NODE_ENV !== 'dev',
    sameSite: 'strict',
  })
}
