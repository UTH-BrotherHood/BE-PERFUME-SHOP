import { checkSchema } from 'express-validator'
import { CATEGORY_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import categoriesService from '~/services/categories.services'
import productsService from '~/services/products.services'
import { validate } from '~/utils/validation.utils'

export const createProductValidation = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.NAME_OF_PRODUCT_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const isProductExist = await productsService.checkProdcutExistByName(value)
            if (isProductExist) {
              throw new Error(PRODUCTS_MESSAGES.PRODUCT_ALREADY_EXIST)
            }
            return !isProductExist
          }
        }
      },
      description: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.DESCRIPTION_OF_PRODUCT_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.PRODUCT_MUST_BE_STRING
        }
      },
      discount: {
        trim: true,
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.DISCOUNT_MUST_BE_NUMBER
        }
      },
      images: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.IMAGES_IS_REQUIRED
        },
        isArray: {
          errorMessage: PRODUCTS_MESSAGES.IMAGES_MUST_BE_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            //yêu cầu mỗi phần tử trong mảng hashtags phải là string
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(PRODUCTS_MESSAGES.IMAGES_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      stock: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.STOCK_IS_REQUIRED
        },
        trim: true,
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.STOCK_MUST_BE_NUMBER
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_IS_REQUIRED
        },
        trim: true,
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_NUMBER
        }
      },
      category_id: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const isCategoryExist = await categoriesService.checkCategoryExist(value)
            if (!isCategoryExist) {
              throw new Error(CATEGORY_MESSAGES.CATEGORY_NOT_FOUND)
            }
            return isCategoryExist
          }
        }
      }
    },
    ['body']
  )
)

export const productIdValidation = validate(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRODUCT_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: PRODUCTS_MESSAGES.PRODUCT_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const isProductExist = await productsService.checkProdcutExistById(value)
            if (!isProductExist) {
              throw new Error(PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND)
            }
            return isProductExist
          }
        }
      }
    },
    ['params']
  )
)
