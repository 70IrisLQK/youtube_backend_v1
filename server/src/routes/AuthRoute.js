import authController from '../controllers/AuthController'
import { Router } from 'express'

const authRoute = Router()

authRoute.post('/login', authController.login)

authRoute.post('/register', authController.register)

authRoute.post('/password-reset', authController.forgotPassword)

export default authRoute
