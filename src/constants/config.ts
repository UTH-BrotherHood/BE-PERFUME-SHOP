import { config } from 'dotenv'
import argv from 'minimist'
const options = argv(process.argv.slice(2))

config()

export const envConfig = {
  // Database
  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUserName: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  // Server
  port: (process.env.PORT as string) || 4000,
  // JWT
  jwtSecretForgotPassToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtExpiresIn: process.env.ACCESS_EXPIRES_IN as string,
  jwtRefreshExpiresIn: process.env.REFRESH_EXPIRES_IN as string,
  jwtEmailVerifyExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  jwtForgotPassExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  // Hash
  hashSalt: process.env.HASH_SALT as string,
  // AWS
  awsRegion: process.env.AWS_REGION as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  sesFromAdress: process.env.SES_FROM_ADDRESS as string,
  // Client
  clientUrl: process.env.CLIENT_URL as string
} as const
