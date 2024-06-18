import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CARTS_MESSAGES } from '~/constants/messages'
import { CartReqBody } from '~/models/requests/carts.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import cartsService from '~/services/carts.services'

export const addToCartcontroller = async (
  req: Request<ParamsDictionary, any, CartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id
  const quantity = Number(req.body.quantity)
  const result = await cartsService.addToCart({ user_id, product_id, quantity })
  return res.json({
    message: CARTS_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
    result
  })
}

export const deleteFromCartcontroller = async (
  req: Request<ParamsDictionary, any, CartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id
  const result = await cartsService.deleteFromCart({ user_id, product_id })
  return res.json({
    message: CARTS_MESSAGES.DELETE_FROM_CART_SUCCESSFULLY,
    result
  })
}

export const changeQuantityOfProductInCartcontroller = async (
  req: Request<ParamsDictionary, any, CartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const product_id = req.body.product_id
  const quantity = Number(req.body.quantity)
  const result = await cartsService.changeQuantityOfProductInCart({ user_id, product_id, quantity })
  return res.json({
    message: CARTS_MESSAGES.CHANGE_QUANTITY_OF_PRODUCT_IN_CART_SUCCESSFULLY,
    result
  })
}

export const getCartcontroller = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await cartsService.getCart({ user_id })
  return res.json({
    message: CARTS_MESSAGES.GET_CART_SUCCESSFULLY,
    result
  })
}
