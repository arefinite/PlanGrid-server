import { Router } from 'express'
import { getAccessLogs } from '../controller/accessLog.controller'

export const accessLogRouter = Router()

accessLogRouter.get('/logs', getAccessLogs)
