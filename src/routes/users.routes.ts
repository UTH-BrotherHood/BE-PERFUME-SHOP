import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidation, registerValidation } from '~/middlewares/users.controllers'
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
