export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  REGISTER_FAILED: 'User registration failed',
  NAME_REQUIRED: 'Name is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXIST: 'Email already exists',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH: 'Name must be at least 1 character long and at most 100 characters long',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_MUST_BE_STRONG:
    ' Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number and one symbol',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_MATCH: 'Confirm password must match with password',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  REGISTER_SUCCESSFULLY: 'Register successfully',
  //logout
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  //accessToken
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  //refreshToken
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_MUST_BE_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  //Email verification
  EMAIL_VERIFICATION_TOKEN_REQUIRED: 'Email verification token is required',
  EMAIL_VERIFICATION_TOKEN_MUST_BE_STRING: 'Email verification token must be a string',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  USER_NOT_FOUND: 'User not found',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',
  //   resendVerifyEmailController
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  // forgotPassword
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset password',
  // verifyForgotPassword
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password successfully',
  // resetPassword
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  // get me
  GET_ME_SUCCESSFULLY: 'Get me successfully',
  // user not verified
  USER_NOT_VERIFIED: 'User not verified'
} as const

export const CATEGORY_MESSAGES = {
  NAME_OF_CATEGORY_REQUIRED: 'Name of category is required',
  DESCRIPTION_OF_CATEGORY_REQUIRED: 'Description of category is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  CATEGORY_REQUIRED: 'Category is required',
  CATEGORY_MUST_BE_STRING: 'Category must be a string',
  CATEGORY_LENGTH: 'Category must be at least 1 character long and at most 100 characters long',
  CATEGORY_ALREADY_EXIST: 'Category already exists',
  CATEGORY_NOT_FOUND: 'Category not found',
  CREATE_CATEGORY_SUCCESSFULLY: 'Create category successfully',
  GET_CATEGORIES_SUCCESSFULLY: 'Get categories successfully',
  GET_CATEGORY_SUCCESSFULLY: 'Get category successfully',
  UPDATE_CATEGORY_SUCCESSFULLY: 'Update category successfully',
  DELETE_CATEGORY_SUCCESSFULLY: 'Delete category successfully',
  CATEGORY_ID_REQUIRED: 'Category id is required',
  CATEGORY_ID_MUST_BE_STRING: 'Category id must be a string'
} as const

export const PRODUCTS_MESSAGES = {
  NAME_OF_PRODUCT_REQUIRED: 'Name of product is required',
  DESCRIPTION_OF_PRODUCT_REQUIRED: 'Description of product is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  PRODUCT_REQUIRED: 'Product is required',
  DISCOUNT_MUST_BE_NUMBER: 'Discount must be a number',
  IMAGES_IS_REQUIRED: 'Images is required',
  IMAGES_MUST_BE_ARRAY: 'Images must be an array',
  IMAGES_MUST_BE_AN_ARRAY_OF_STRING: 'Images must be an array of string',
  STOCK_MUST_BE_NUMBER: 'Stock must be a number',
  STOCK_IS_REQUIRED: 'Stock is required',
  PRICE_IS_REQUIRED: 'Price is required',
  PRICE_MUST_BE_NUMBER: 'Price must be a number',
  CATEGORY_ID_REQUIRED: 'Category id is required',
  CATEGORY_ID_MUST_BE_STRING: 'Category id must be a string',
  PRODUCT_MUST_BE_STRING: 'Product must be a string',
  PRODUCT_ALREADY_EXIST: 'Product already exists',
  PRODUCT_NOT_FOUND: 'Product not found',
  CREATE_PRODUCT_SUCCESSFULLY: 'Create product successfully',
  GET_PRODUCTS_SUCCESSFULLY: 'Get products successfully',
  GET_PRODUCT_SUCCESSFULLY: 'Get product successfully',
  UPDATE_PRODUCT_SUCCESSFULLY: 'Update product successfully',
  DELETE_PRODUCT_SUCCESSFULLY: 'Delete product successfully',
  PRODUCT_ID_REQUIRED: 'Product id is required',
  PRODUCT_ID_MUST_BE_STRING: 'Product id must be a string',
  LIMIT_MUST_BE_BETWEEN_1_AND_100: 'Limit must be between 1 and 100',
  PAGE_MUST_BE_GREATER_THAN_0: 'Page must be greater than 0'
} as const

export const WISHLIST_MESSAGES = {
  ADD_TO_WISHLIST_SUCCESSFULLY: 'Add to wishlist successfully',
  GET_WISHLIST_SUCCESSFULLY: 'Get wishlist successfully',
  DELETE_FROM_WISHLIST_SUCCESSFULLY: 'Delete from wishlist successfully',
  WISHLIST_NOT_FOUND: 'Wishlist not found',
  WISHLIST_ID_REQUIRED: 'Wishlist id is required',
  WISHLIST_ID_MUST_BE_STRING: 'Wishlist id must be a string',
  WISHLIST_REQUIRED: 'Wishlist is required',
  WISHLIST_MUST_BE_STRING: 'Wishlist must be a string',
  WISHLIST_ALREADY_EXIST: 'Wishlist already exists'
} as const

export const CARTS_MESSAGES = {
  ADD_TO_CART_SUCCESSFULLY: 'Add to cart successfully',
  GET_CART_SUCCESSFULLY: 'Get cart successfully',
  DELETE_FROM_CART_SUCCESSFULLY: 'Delete from cart successfully',
  CHANGE_QUANTITY_OF_PRODUCT_IN_CART_SUCCESSFULLY: 'Change quantity of product in cart successfully'
} as const

export const ORDERS_MESSAGES = {
  CREATE_ORDER_SUCCESSFULLY: 'Create order successfully',
  CART_IS_EMPTY: 'Cart is empty, please add product to cart before buying',
  ADDRESS_ID_REQUIRED: 'Address id is required',
  ADDRESS_ID_MUST_BE_STRING: 'Address id must be a string',
  PAYMENT_ID_REQUIRED: 'Payment id is required',
  PAYMENT_ID_MUST_BE_STRING: 'Payment id must be a string'
} as const
