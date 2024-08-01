import { Router } from "express";
import { updateUser } from "../controller/user.controller";
import { verifyToken } from "../middleware/verifyToken";


export const userRouter = Router()

userRouter.patch('/update-user',verifyToken, updateUser)