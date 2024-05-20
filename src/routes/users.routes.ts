import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouters = Router()
/* 
Description: This route is used to register a new user
Method: POST
Body: { 
    "email": string,
    "username": string ,
    "password": string,
    "confirm_password" : string,
    "date_of_birth": string , dạng ISO 8601
}
 */
usersRouters.post('/register', registerValidation, wrapRequestHandler(registerController))

/*
Description: This route is used to login
Path: /login
Method: POST
Body: { 
  "email": "string", 
  "password": "string" 
}
 */
usersRouters.post('/login', loginValidation, wrapRequestHandler(loginController))
export default usersRouters

/*
Description: This route is used to logout
Path: /logout
Method: POST
Headers: { Authorization : Bearer <accessToken> }
Body: { refresh_token : string}
*/
usersRouters.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

/*
Description: Refresh token  
Path: /refresh-token
Method: POST
Body: { refresh_token : string}
*/
usersRouters.post('/refresh-token', refreshTokenValidation, wrapRequestHandler(refreshTokenController))
