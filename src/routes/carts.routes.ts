import { Router } from 'express'
import {
  addToCartcontroller,
  changeQuantityOfProductInCartcontroller,
  deleteFromCartcontroller,
  getCartcontroller
} from '~/controllers/carts.controllers'
import { productIdValidation } from '~/middlewares/products.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const cartsRouters = Router()

/**
 * Description: add to cart
 * Path: /
 * Method: POST
 * Body : { product_id : string, quantity: number}
 * Header: {Authorization: Bearer token}
 */
cartsRouters.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  productIdValidation,
  wrapRequestHandler(addToCartcontroller)
)

/**
 * Description: delete from cart
 * Path: /
 * Method: POST
 * Body : { product_id : string}
 * Header: {Authorization: Bearer token}
 */
cartsRouters.delete(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  productIdValidation,
  wrapRequestHandler(deleteFromCartcontroller)
)

/**
 * Description: change quantity of product in cart
 * Path: /
 * Method: POST
 * Body : { product_id : string, quantity: number}
 * Header: {Authorization: Bearer token}
 */
cartsRouters.patch(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  productIdValidation,
  wrapRequestHandler(changeQuantityOfProductInCartcontroller)
)

/**
 * Description: get cart details
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
cartsRouters.get('/', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(getCartcontroller))

export default cartsRouters
