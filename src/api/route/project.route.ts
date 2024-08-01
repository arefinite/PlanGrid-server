import { Router } from 'express'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  getUserProjects,
  updateProject,
} from '../controller/project.controller'
import { verifyToken } from '../middleware/verifyToken'

export const projectRouter = Router()

projectRouter.get('/get-all-projects', verifyToken, getAllProjects)
projectRouter.get('/get-project/:id', verifyToken, getProject)
projectRouter.get('/get-user-projects', verifyToken, getUserProjects)
projectRouter.post('/create-project', verifyToken, createProject)
projectRouter.patch('/update-project/:id', verifyToken, updateProject)
projectRouter.delete('/delete-project/:id', verifyToken, deleteProject)
