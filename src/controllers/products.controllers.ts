import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { ProductReqBody, UpdateProductReqBody } from '~/models/requests/product.requests'
import productsService from '~/services/products.services'

export const createProductController = async (req: Request<ParamsDictionary, any, ProductReqBody>, res: Response) => {
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
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await productsService.getProducts(limit, page)
  return res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCTS_SUCCESSFULLY,
    result,
    limit,
    page,
    total_pages: Math.ceil(result.total / limit)
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

export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response
) => {
  const { product_id } = req.params
  const result = await productsService.updateProduct(product_id, req.body)
  return res.json({
    message: PRODUCTS_MESSAGES.UPDATE_PRODUCT_SUCCESSFULLY,
    result
  })
}
