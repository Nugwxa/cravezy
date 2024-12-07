import loginUserHandler from '@/controllers/auth/loginUserHandler'
import express from 'express'

const authRouter = express.Router()

authRouter.use(express.json())

authRouter.post('/login', loginUserHandler)

export default authRouter
