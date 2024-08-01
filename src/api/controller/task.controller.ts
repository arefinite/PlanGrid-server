import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { Task } from '../model/task.model'
import createHttpError from 'http-errors'
import { taskValidationSchema } from '../validator/task.validator'
import { User } from '../model/user.model'
import { ActivityLog } from '../model/activityLog.model'

//@desc get all tasks
//@route GET /api/v1/tasks/get-all-tasks
//@access Private
export const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const tasks = await Task.find()
    if (!tasks) return next(createHttpError(404, 'No tasks found'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for all tasks`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(tasks)
  }
)

//@desc get a task
//@route GET /api/v1/tasks/get-task
//@access Private
export const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const userId = req.userId
    const task = await Task.findById(id)
    if (!task) return next(createHttpError(404, 'Task not found'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for task: ${task.title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(task)
  }
)

//@desc get user tasks
//@route GET /api/v1/tasks/get-user-tasks
//@access Private
export const getUserTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const tasks = await Task.find({ userId })
    if (!tasks) return next(createHttpError(404, 'No tasks found of this user'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for own tasks`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(tasks)
  }
)

//@desc create a task
//@route POST /api/v1/tasks/create-task
//@access Private
export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //the the session user id
    const userId = req.userId
    //validate the request body
    const { title, description, priority, status, projectId } = req.body
    //create the task
    const task = await Task.create({
      title,
      description,
      priority,
      status,
      projectId,
      userId,
    })
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'create',
      description: `created task: ${title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(201).json({ message: 'Create task successful' })
  }
)

//@desc update a task
//@route PATCH /api/v1/tasks/update-task
//@access Private
export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the task id
    const { id } = req.params
    //get the session user id
    const userId = req.userId
    //validate the request body
    const { title, description, priority, status, projectId } =
      taskValidationSchema.parse(req.body)
    //check if the task exists
    const task = await Task.findById(id)
    if (!task) return next(createHttpError(404, 'Task not found'))
    //check if the user is the owner of the task
    if (task.userId.toString() !== userId)
      return next(createHttpError(401, 'You can only update your created task'))
    //update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        priority,
        status,
        projectId,
      },
      { new: true }
    )
    if (!updatedTask) return next(createHttpError(400, 'Update task failed'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'update',
      description: `updated task: ${title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json({ message: 'Update task successful' })
  }
)

//@desc delete a task
//@route DELETE /api/v1/tasks/delete-task
//@access Private
export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the task id
    const { id } = req.params
    //get the session user id
    const userId = req.userId
    //check if the user exists
    const user = await User.findById(userId)
    if (!user) return next(createHttpError(404, 'user not found'))
    //check if the user is the owner of the task
    const task = await Task.findById(id)
    if (!task) return next(createHttpError(404, 'Task not found'))
    if (userId !== task.userId.toString())
      return next(createHttpError(401, 'You can only delete your created task'))
    //delete the task
    const deletedTask = await Task.findByIdAndDelete(id)
    if (!deletedTask) return next(createHttpError(400, 'Delete task failed'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'delete',
      description: `delete task: ${task.title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json({ message: 'Delete task successful' })
  }
)
