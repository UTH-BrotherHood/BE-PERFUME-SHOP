import { checkSchema } from 'express-validator'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import categoriesService from '~/services/categories.services'
import { validate } from '~/utils/validation.utils'

export const createCategoryValidation = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.NAME_OF_CATEGORY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.NAME_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const isCategoryExist = await categoriesService.checkCategoryExistByName(value)
            if (isCategoryExist) {
              throw new Error(CATEGORY_MESSAGES.CATEGORY_ALREADY_EXIST)
            }
            return !isCategoryExist
          }
        }
      },
      description: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.DESCRIPTION_OF_CATEGORY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.CATEGORY_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)

export const categoryIdValidation = validate(
  checkSchema({
    category_id: {
      notEmpty: {
        errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_REQUIRED
      },
      trim: true,
      isString: {
        errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_MUST_BE_STRING
      },
      custom: {
        options: async (value) => {
          const isCategoryExist = await categoriesService.checkCategoryExist(value)
          if (isCategoryExist) {
            throw new Error(CATEGORY_MESSAGES.CATEGORY_ALREADY_EXIST)
          }
          return !isCategoryExist
        }
      }
    }
  })
)

export const updateCategoryValidation = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.NAME_OF_CATEGORY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.NAME_MUST_BE_STRING
        }
      },
      description: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.DESCRIPTION_OF_CATEGORY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.CATEGORY_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)
