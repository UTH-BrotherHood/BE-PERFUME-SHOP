import { Router } from 'express'
import { registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouters = Router()
/* 
Description: This route is used to register a new user
Method: POST
Body: { "name": "string", "email": "string", "password": "string", "confirmPassword": "string" ,"data_of_birth": ISO08601}
 */
usersRouters.post('/register', wrapRequestHandler(registerController))

export default usersRouters
