import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import path from 'node:path'
import cors from 'cors'
import { config } from '../config/config'
import morgan from 'morgan'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import { authRouter } from './route/auth.route'
import { projectRouter } from './route/project.route'
import { taskRouter } from './route/task.route'
import { userRouter } from './route/user.route'
import { activityLogRouter } from './route/activityLog.route'
import { accessLogRouter } from './route/accessLog.route'

export const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }))
if (config.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname, '../../../client/dist')))

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/activity-logs', activityLogRouter)
app.use('/api/v1/access-logs', accessLogRouter)

//not found route
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Not route found' })
})

//custom error logger
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(
    `Invalid field: ${err.fieldName} - Invalid value: ${err.value} - Error message: ${err.message} - Error name: ${err.name}`
  )
  next(err)
})

//global error handler
app.use(globalErrorHandler)
