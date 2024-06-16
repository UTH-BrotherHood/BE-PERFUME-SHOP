import { Router } from 'express'
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController
} from '~/controllers/categories.controllers'
import {
  categoryIdValidation,
  createCategoryValidation,
  updateCategoryValidation
} from '~/middlewares/categories.middlewares'
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

categoriesRouter.post(
  '/',
  accessTokenValidation,
  createCategoryValidation,
  wrapRequestHandler(createCategoryController)
)

/**
 * Description: Get category details
 * Path: /:category_id
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */

categoriesRouter.get(
  '/:category_id',
  accessTokenValidation,
  categoryIdValidation,
  wrapRequestHandler(getCategoryController)
)

/*
Description: Update category
Path: /me
Headers: { Authorization : Bearer <accessToken> }
Method: PATCH
Body : User Schema
*/
categoriesRouter.patch(
  '/:category_id',
  accessTokenValidation,
  categoryIdValidation,
  updateCategoryValidation,
  wrapRequestHandler(updateCategoryController)
)

/**
 * Description: unBookmark
 * Path: /tweets/:tweet_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
categoriesRouter.delete(
  '/:category_id',
  accessTokenValidation,
  categoryIdValidation,
  wrapRequestHandler(deleteCategoryController)
)

/**
 * Description: Get all categories
 * Path: /
 * Method: GET
 * Header: {Authorization?: Bearer <access_token> }
 */

categoriesRouter.get('/', accessTokenValidation, wrapRequestHandler(getCategoriesController))

export default categoriesRouter
