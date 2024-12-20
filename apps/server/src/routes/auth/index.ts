import express from 'express'
import loginUserHandler from '@/controllers/auth/loginUserHandler'
import passwordResetRequestHandler from '@/controllers/auth/passwordResetRequestHandler'
import readSessionHandler from '@/controllers/auth/readSessionHandler'

const authRouter = express.Router()

authRouter.use(express.json())

// Session
authRouter.post('/login', loginUserHandler)
authRouter.get('/session', readSessionHandler)

// User
authRouter.post('/password-reset', passwordResetRequestHandler)

export default authRouter
