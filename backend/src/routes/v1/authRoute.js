import express from 'express'

import { authValidation } from '~/validations/authValidation'
import { authController } from '~/controllers/authController'

const Router = express.Router()

// Đăng ký tài khoản.
Router.route('/register').post(authValidation.register, authController.register)

Router.route('/verify').put(authValidation.verify, authController.verify)

// Đăng nhập, nhận JWT token.
Router.route('/login').post(authValidation.login, authController.login)

// Đăng xuất
Router.route('/logout').delete(authController.logout)

// Refresh Token
Router.route('/refresh_token').get(authController.refreshToken)

export const authRoute = Router
