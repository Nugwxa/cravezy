import captchaRouter from './captcha'
import express, { NextFunction, Request, Response } from 'express'
import userRoutes from './user'

const baseRouter = express.Router()

baseRouter.use('/users', userRoutes)
baseRouter.use('/captcha', captchaRouter)

// Global error handling middleware
baseRouter.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      success: false,
      message: err.message || 'Unexpected Server Error',
    })
  }
)

export default baseRouter
