import { model, Schema } from "mongoose";


const accessLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
},
  {
    timestamps: true
  }
)

export const AccessLog = model('AccessLog', accessLogSchema)