import loginUserHandler from '@/controllers/auth/loginUserHandler'
import passwordResetRequestHandler from '@/controllers/auth/passwordResetRequestHandler'
import express from 'express'

const authRouter = express.Router()

authRouter.use(express.json())

authRouter.post('/login', loginUserHandler)

authRouter.post('/password-reset', passwordResetRequestHandler)

export default authRouter
