import express from 'express'
import { login, register, verifyOTP } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/verify', verifyOTP)


export default userRouter