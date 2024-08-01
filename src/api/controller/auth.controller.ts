import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import {
  signInValidationSchema,
  signUpValidationSchema,
} from '../validator/auth.validator'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import { User } from '../model/user.model'
import { generateToken } from '../service/token.service'
import { ActivityLog } from '../model/activityLog.model'
import { AccessLog } from '../model/accessLog.model'

//@desc Sign-up a user
//@route POST /api/v1/auth/sign-up
//@access Public
export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = signUpValidationSchema.parse(req.body)
    //lower case email
    const lowercaseEmail = email.toLowerCase()
    //check if user already exists
    const user = await User.findOne({ email: lowercaseEmail })
    if (user) return next(createHttpError(400, 'User already exists'))
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create a new user
    const newUser = await User.create({
      fullName,
      email: lowercaseEmail,
      password: hashedPassword,
    })
    if (!newUser) return next(createHttpError(400, 'Sign Up failed'))
    //generate token and store in in cookie
    generateToken(res, newUser._id.toString())
    //add to access log
    const addToAccessLog = await AccessLog.create({ userId: newUser._id })
    if (!addToAccessLog)
      return next(createHttpError(400, 'Something went wrong with access log'))
    //send response
    res.status(201).json({ message: 'Sign up successful' })
  }
)

//@desc Sign-in a user
//@route POST /api/v1/auth/sign-in
//@access Public
export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = signInValidationSchema.parse(req.body)
    //lower case email
    const lowercaseEmail = email.toLowerCase()
    //check if user exists
    const user = await User.findOne({ email: lowercaseEmail })
    if (!user) return next(createHttpError(400, 'Invalid credentials'))
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return next(createHttpError(400, 'Invalid credentials'))
    //generate token and store in in cookie
    generateToken(res, user._id)
    //add to access log
    const addToAccessLog = await AccessLog.create({ userId: user!._id })
    if (!addToAccessLog)
      return next(createHttpError(400, 'Something went wrong with access log'))
    //send response
    res.status(200).json({ message: 'Sign in successful' })
  }
)

//@desc Sign-out a user
//@route POST /api/v1/auth/sign-out
//@access Private
export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //clear cookie
    res.clearCookie('auth-token')
    //send response
    res.status(200).json({ message: 'Sign out successful' })
  }
)

//@desc verify user
//@route GET /api/v1/auth/validate-user
//@access Private
export const validateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ userId: req.userId })
  }
)

//@desc get current user
//@route GET /api/v1/auth/current-user
//@access Private
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.userId
    const user = await User.findById(id).select('-password')
    if (!user) return next(createHttpError(404, 'User not found'))
    res.status(200).json(user)
  }
)
