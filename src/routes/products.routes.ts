import { Router } from 'express'
import { createProductController, deleteProductController } from '~/controllers/products.controllers'
import { createProductValidation, productIdValidation } from '~/middlewares/products.middlewares'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const productsRouters = Router()

/**
 * Description: create a new product
 * Path: /
 * Method: POST
 * Header: {Authorization?: Bearer <access_token> }
 * Body : ProductReqBody
 */

productsRouters.post('/', accessTokenValidation, createProductValidation, wrapRequestHandler(createProductController))

/**
 * Description: delete a product
 * Path: /:product_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
productsRouters.delete(
  '/:product_id',
  accessTokenValidation,
  productIdValidation,
  wrapRequestHandler(deleteProductController)
)

export default productsRouters
