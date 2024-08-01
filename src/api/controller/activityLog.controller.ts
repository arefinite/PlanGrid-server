import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { ActivityLog } from '../model/activityLog.model'
import createHttpError from 'http-errors'

//@desc get activity log
//@route GET /api/v1/activity-logs/logs
//@access Private
export const getActivityLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const activityLogs = await ActivityLog.find()
    if (!activityLogs)
      return next(createHttpError(404, 'No activity logs found'))
    res.status(200).json(activityLogs)
  }
)
