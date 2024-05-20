import { Pool } from 'pg'
import { config } from 'dotenv'
import { tokenType, userVerificationStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import { RegisterReqBody } from '~/models/requests/user.requests'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { v4 as uuidv4 } from 'uuid'
import User from '~/models/schemas/user.schemas'
config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_EXPIRES_IN
      }
    })
  }
  private signRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: string
    verify: userVerificationStatus
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: tokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_EXPIRES_IN
      }
    })
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.EmailVerificationToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.EmailVerificationToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublickey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }
  async register(payload: RegisterReqBody) {
    const user_id = uuidv4()
    const cart_id = uuidv4()
    console.log('user_id : ', user_id)
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id,
      verify: userVerificationStatus.Unverified
    })

    const hashed_password = hashPassword(payload.password)
    const date_of_birth = new Date(payload.date_of_birth)

    const user = new User({
      ...payload
    })

    await databaseServices.query(
      `INSERT INTO users (id, username, email, password, email_verification_token, date_of_birth , verify , cart_id )
      VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)`,
      [
        user_id,
        user.name || '',
        user.email,
        hashed_password,
        user.email_verification_token || '',
        date_of_birth,
        userVerificationStatus.Unverified,
        cart_id
      ]
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id,
      verify: userVerificationStatus.Unverified
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseServices.query(
      `INSERT INTO refresh_tokens (user_id, token, iat, exp)
         VALUES ($1, $2, $3, $4)`,
      [user_id, refresh_token, iat, exp]
    )

    console.log('email_verification_token : ', email_verify_token)
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const result = await databaseServices.query(`SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)`, [email])
    return result.rows[0].exists
  }
}

const usersService = new UsersService()

export default usersService
