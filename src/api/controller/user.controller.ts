import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { User } from '../model/user.model'

//@desc update a user
//@route PATCH /api/v1/user/update-user
//@access Private
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    let { fullName, currentPassword, newPassword } = req.body

    if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
      return next(
        createHttpError(400, 'Please provide both passwords to change password')
      )
    }

    // Find the user
    let user = await User.findById(userId)
    if (!user) return next(createHttpError(404, 'User not found'))

    if (currentPassword && newPassword) {
      // Match the current password
      const isMatched = await bcrypt.compare(currentPassword, user.password)
      if (!isMatched) return next(createHttpError(400, 'Invalid credentials'))

      if (newPassword.length < 6) {
        return next(
          createHttpError(400, 'Password must be at least 6 characters')
        )
      }

      // Hash the new password
      user.password = await bcrypt.hash(newPassword, 10)
    }

    // Update the user
    user.fullName = fullName || user.fullName
    user = await user.save()
    res.status(200).json({ message: 'User updated successfully' })
  }
)
