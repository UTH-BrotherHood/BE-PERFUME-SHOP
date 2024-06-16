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

export const deleteProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { product_id } = req.params
  const result = await productsService.deleteProduct(product_id)
  return res.json({
    message: PRODUCTS_MESSAGES.DELETE_PRODUCT_SUCCESSFULLY,
    result
  })
}

export const getProductsController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await productsService.getProducts()
  return res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCTS_SUCCESSFULLY,
    result
  })
}

export const getProductController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { product_id } = req.params
  const result = await productsService.getProduct(product_id)
  return res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESSFULLY,
    result
  })
}
