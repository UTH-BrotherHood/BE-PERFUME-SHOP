import { Router } from 'express'
import { createProductController } from '~/controllers/products.controllers'
import { createProductValidation } from '~/middlewares/products.middlewares'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const productsRouters = Router()

/**
 * Description: create a new category
 * Path: /
 * Method: POST
 * Header: {Authorization?: Bearer <access_token> }
 * Body : CategoryResBody
 */

productsRouters.post('/', accessTokenValidation, createProductValidation, wrapRequestHandler(createProductController))

export default productsRouters
