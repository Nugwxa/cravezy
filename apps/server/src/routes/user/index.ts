import { createUserHandler } from '@/controllers/users'
import express from 'express'

const userRouter = express.Router()

userRouter.use(express.json())

userRouter.post('/', createUserHandler)

export default userRouter
