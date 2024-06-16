import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { ProductReqBody } from '~/models/requests/product.requests'
import productsService from '~/services/products.services'

export const createProductController = async (req: Request<ParamsDictionary, any, ProductReqBody>, res: Response) => {
  console.log(req.body)
  const result = await productsService.createProduct(req.body)
  return res.json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESSFULLY,
    result
  })
}
