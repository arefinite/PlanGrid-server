import { Types } from 'mongoose'

export interface IUser {
  _id?: string
  fullName: string
  email: string
  password: string
}

export interface IProject {
  _id?: string
  deadline: Date
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: boolean
  budget: number
  tags: string[]
  difficulty: number
  userId: Types.ObjectId
  contributors: Types.ObjectId[]
}

export interface ITask {
  _id?: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
  projectId: Types.ObjectId
  userId: Types.ObjectId
}

export interface IActivityLog {
  _id?: string
  userId: Types.ObjectId
  action: string
  description: string
}

export interface IAccessLog {
  _id?: string
  userId: Types.ObjectId
}
