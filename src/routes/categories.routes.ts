import { Router } from 'express'
import { createCategoryController, getCategoriesController } from '~/controllers/categories.controllers'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const categoriesRouter = Router()

/**
 * Description: create a new category
 * Path: /
 * Method: POST
 * Header: {Authorization?: Bearer <access_token> }
 * Body : CategoryResBody
 */

categoriesRouter.post('/', accessTokenValidation, wrapRequestHandler(createCategoryController))

/**
 * Description: Get all categories
 * Path: /
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */

categoriesRouter.get('/', accessTokenValidation, wrapRequestHandler(getCategoriesController))

export default categoriesRouter
