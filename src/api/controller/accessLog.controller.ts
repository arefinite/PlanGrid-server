import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { AccessLog } from '../model/accessLog.model'
import createHttpError from 'http-errors'

//@desc get access log
//@route GET /api/v1/access-logs/logs
//@access Private
export const getAccessLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessLogs = await AccessLog.find()
    if (!accessLogs) return next(createHttpError(404, 'No access logs found'))
    res.status(200).json(accessLogs)
  }
)
