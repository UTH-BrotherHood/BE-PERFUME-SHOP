import { Router } from 'express'
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController
} from '~/controllers/products.controllers'
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

/**
 * Description: Get all products
 * Path: /
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */

productsRouters.get('/', accessTokenValidation, wrapRequestHandler(getProductsController))

/**
 * Description: Get product details
 * Path: /:category_id
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */

productsRouters.get(
  '/:product_id',
  accessTokenValidation,
  productIdValidation,
  wrapRequestHandler(getProductController)
)

export default productsRouters
