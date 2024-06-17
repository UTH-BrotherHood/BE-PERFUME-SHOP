import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { WISHLIST_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/user.requests'
import { WishlistReqBody } from '~/models/requests/wishlist.requests'
import wishlistService from '~/services/wishlist.services'

export const addToWishlistcontroller = async (
  req: Request<ParamsDictionary, any, WishlistReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id
  console.log('user_id', user_id)
  console.log('product_id', product_id)
  const result = await wishlistService.addToWishlist(user_id, product_id)
  return res.json({
    message: WISHLIST_MESSAGES.ADD_TO_WISHLIST_SUCCESSFULLY,
    result
  })
}

export const deleteFromWishlistcontroller = async (
  req: Request<ParamsDictionary, any, WishlistReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id
  const result = await wishlistService.deleteFromWishlist(user_id, product_id)
  return res.json({
    message: WISHLIST_MESSAGES.DELETE_FROM_WISHLIST_SUCCESSFULLY,
    result
  })
}
