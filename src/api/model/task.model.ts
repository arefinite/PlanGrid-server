import { model, Schema } from 'mongoose'
import { ITask } from '../interface/interfaces'

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['high', 'medium', 'low'],
    },
    status: {
      type: String,
      required: true,
      enum: ['todo', 'in-progress', 'done'],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Task = model<ITask>('Task', taskSchema)
