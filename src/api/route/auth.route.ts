import { Router } from 'express'
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  validateUser,
} from '../controller/auth.controller'
import { verifyToken } from '../middleware/verifyToken'

export const authRouter = Router()

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)
authRouter.get('/validate-user', verifyToken, validateUser)
authRouter.get('/get-current-user', verifyToken, getCurrentUser)
