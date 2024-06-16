import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/errors'
import { CategoryReqBody } from '~/models/requests/category.requests'
import categoriesService from '~/services/categories.services'
import databaseServices from '~/services/database.services'

export const createCategoryController = async (req: Request<ParamsDictionary, any, CategoryReqBody>, res: Response) => {
  const result = await categoriesService.creatCategory(req.body)
  return res.json({
    message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESSFULLY,
    result
  })
}
export const getCategoryController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { category_id } = req.params
  const result = await categoriesService.getCategory(category_id)
  return res.json({
    message: CATEGORY_MESSAGES.GET_CATEGORY_SUCCESSFULLY,
    result
  })
}

export const updateCategoryController = async (req: Request<ParamsDictionary, any, CategoryReqBody>, res: Response) => {
  const { category_id } = req.params
  const result = await categoriesService.updateCategory(category_id, req.body)
  return res.json({
    message: CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESSFULLY,
    result
  })
}

export const deleteCategoryController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { category_id } = req.params
  await categoriesService.deleteCategory(category_id)
  return res.json({
    message: CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESSFULLY
  })
}

export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await categoriesService.getCategories()
  return res.json({
    message: CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESSFULLY,
    result
  })
}
