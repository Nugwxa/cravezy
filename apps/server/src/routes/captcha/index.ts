import validateCaptchaHandler from '@/controllers/captcha/validateCaptchaHandler'
import express from 'express'

const captchaRouter = express.Router()

captchaRouter.use(express.json())

captchaRouter.post('/validate', validateCaptchaHandler)

export default captchaRouter
