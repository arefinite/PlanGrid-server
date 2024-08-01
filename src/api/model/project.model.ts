import { model, Schema } from 'mongoose'
import { IProject } from '../interface/interfaces'

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: Date,
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
      type: Boolean,
      required: true,
      default: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 5,
    },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const Project = model<IProject>('Project', projectSchema)
