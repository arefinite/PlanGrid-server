import { Router } from 'express'
import { getActivityLogs } from '../controller/activityLog.controller'

export const activityLogRouter = Router()

activityLogRouter.get('/logs', getActivityLogs)
