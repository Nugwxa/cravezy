import authenticationMiddleware from '@/middlewares/authentication'
import express from 'express'
import loginUserHandler from '@/controllers/auth/loginUserHandler'
import passwordResetRequestHandler from '@/controllers/auth/passwordResetRequestHandler'
import readSessionHandler from '@/controllers/auth/readSessionHandler'
import passwordResetTokenVerificationHandler from '@/controllers/auth/passwordResetTokenVerificationHandler'

const authRouter = express.Router()

authRouter.use(express.json())

// Session
authRouter.post('/login', loginUserHandler)
authRouter.get('/session', authenticationMiddleware, readSessionHandler)

// User
authRouter.post('/password-reset', passwordResetRequestHandler)
authRouter.get('/password/reset', passwordResetTokenVerificationHandler)

export default authRouter
