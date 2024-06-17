import { Router } from 'express'
import { addToWishlistcontroller, deleteFromWishlistcontroller } from '~/controllers/wishlist.controllers'
import { productIdValidation } from '~/middlewares/products.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const wishlistRouters = Router()

/**
 * Description: add to wishlist
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
wishlistRouters.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  productIdValidation,
  wrapRequestHandler(addToWishlistcontroller)
)

/**
 * Description: delete from wishlist
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
wishlistRouters.delete(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  productIdValidation,
  wrapRequestHandler(deleteFromWishlistcontroller)
)

export default wishlistRouters
