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
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully'
} as const
