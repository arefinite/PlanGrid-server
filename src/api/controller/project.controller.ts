import asyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { Project } from '../model/project.model'
import { projectValidationSchema } from '../validator/project.validator'
import { User } from '../model/user.model'
import { ActivityLog } from '../model/activityLog.model'
import { Task } from '../model/task.model'

//@desc get all projects
//@route GET /api/v1/projects/get-all-projects
//@access Private
export const getAllProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const projects = await Project.find()
    if (!projects) return next(createHttpError(404, 'No projects found'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for all projects`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(projects)
  }
)

//@desc get a project
//@route GET /api/v1/projects/get-project/:id
//@access Private
export const getProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const userId = req.userId
    const project = await Project.findById(id)
    if (!project) return next(createHttpError(404, 'Project not found'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for project: ${project.title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(project)
  }
)

//@desc get all projects by user
//@route GET /api/v1/projects/get-user-projects
//@access Private
export const getUserProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const projects = await Project.find({ userId })
    if (!projects)
      return next(createHttpError(404, 'No projects found of this user'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'query',
      description: `queried for own projects`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json(projects)
  }
)

//@desc create a project
//@route POST /api/v1/projects/create-project
//@access Private
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //the the session user id
    const userId = req.userId
    //validate the request body
    const {
      title,
      description,
      priority,
      status,
      budget,
      tags,
      deadline,
      difficulty,
    } = projectValidationSchema.parse(req.body)
    //create a new project
    const newProject = await Project.create({
      title,
      userId,
      description,
      deadline,
      priority,
      status,
      budget,
      tags,
      difficulty,
    })
    if (!newProject) return next(createHttpError(400, 'Create project failed'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'create',
      description: `created a new project: ${title}`,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(201).json({ message: 'Create project successful' })
  }
)

//@desc update a project
//@route PATCH /api/v1/projects/update-project/:id
//@access Private
export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the project id
    const { id } = req.params
    //get the session user id
    const userId = req.userId
    //validate the request body
    const {
      title,
      description,
      priority,
      status,
      budget,
      deadline,
      tags,
      difficulty,
    } = projectValidationSchema.parse(req.body)
    //check if the user exists
    const user = await User.findById(userId)
    if (!user) return next(createHttpError(404, 'User not found'))
    //check if the user is the owner of the project
    const project = await Project.findById(id)
    if (!project) return next(createHttpError(404, 'Project not found'))
    if (userId !== project.userId.toString())
      return next(
        createHttpError(401, 'You can only update your created project')
      )
    //update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        priority,
        status,
        deadline,
        budget,
        tags,
        difficulty,
      },
      { new: true }
    )
    if (!updatedProject)
      return next(createHttpError(400, 'Update project failed'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'update',
      description: `updated project: ${project.title} `,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json({ message: 'Update project successful' })
  }
)

//@desc delete a project
//@route DELETE /api/v1/projects/delete-project/:id
//@access Private
export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the project id
    const { id } = req.params
    //get the session user id
    const userId = req.userId
    //check if the user exists
    const user = await User.findById(userId)
    if (!user) return next(createHttpError(404, 'User not found'))
    //check if the user is the owner of the project
    const project = await Project.findById(id)
    if (!project) return next(createHttpError(404, 'Project not found'))
    if (userId !== project.userId.toString())
      return next(
        createHttpError(401, 'You can only delete your created project')
      )
    // check if the project has any associated tasks
    const tasks = await Task.find({ projectId: id })
    if (tasks.length > 0) {
      return next(
        createHttpError(400, 'Cannot delete project with associated tasks')
      )
    }

    //delete the project
    const deletedProject = await Project.findByIdAndDelete(id)
    if (!deletedProject)
      return next(createHttpError(400, 'Delete project failed'))
    //add to activity log
    const addToActivityLog = await ActivityLog.create({
      userId: userId,
      action: 'delete',
      description: `deleted project: ${project.title} `,
    })
    if (!addToActivityLog)
      return next(
        createHttpError(400, 'Something went wrong with activity log')
      )
    //send response
    res.status(200).json({ message: 'Delete project successful' })
  }
)
