import { Router } from 'express'
import { createProductController } from '~/controllers/products.controllers'
import { createProductValidation } from '~/middlewares/products.middlewares'
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
 * Description: unBookmark
 * Path: /tweets/:tweet_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
productsRouters.delete(
  '/:category_id',
  accessTokenValidation,
  categoryIdValidation,
  wrapRequestHandler(deleteCategoryController)
)

export default productsRouters
