import { model, Schema } from 'mongoose'
import { IActivityLog } from '../interface/interfaces'

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema)
