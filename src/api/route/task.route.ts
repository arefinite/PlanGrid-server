import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  getUserTasks,
  updateTask,
} from '../controller/task.controller'
import { verifyToken } from '../middleware/verifyToken'

export const taskRouter = Router()

taskRouter.get('/get-all-tasks', verifyToken, getAllTasks)
taskRouter.get('/get-task/:id', verifyToken, getTask)
taskRouter.get('/get-user-tasks', verifyToken, getUserTasks)
taskRouter.post('/create-task', verifyToken, createTask)
taskRouter.patch('/update-task/:id', verifyToken, updateTask)
taskRouter.delete('/delete-task/:id', verifyToken, deleteTask)
