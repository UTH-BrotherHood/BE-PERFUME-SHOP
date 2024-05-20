import { Pool } from 'pg'
import { config } from 'dotenv'
import { tokenType, userVerificationStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import { RegisterReqBody } from '~/models/requests/user.requests'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { v4 as uuidv4 } from 'uuid'
import User from '~/models/schemas/user.schemas'
import { USERS_MESSAGES } from '~/constants/messages'
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
      `INSERT INTO users (id, username, email, password, email_verification_token, date_of_birth , verify , cart_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)`,
      [
        user_id,
        user.name || '',
        user.email,
        hashed_password,
        email_verify_token,
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

  async login({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseServices.query(
      `INSERT INTO refresh_tokens (user_id, token, iat, exp)
        VALUES ($1, $2, $3, $4)`,
      [user_id, refresh_token, iat, exp]
    )

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseServices.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refresh_token])

    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESSFULLY
    }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: userVerificationStatus
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      databaseServices.query(`DELETE FROM refresh_tokens WHERE token = $1`, [refresh_token])
    ])

    const decode_refresh_token = await this.decodeRefreshToken(new_refresh_token)

    await databaseServices.query(
      `INSERT INTO refresh_tokens (user_id, token, iat, exp)
      VALUES ($1, $2, $3, $4)`,
      [user_id, new_refresh_token, decode_refresh_token.iat, decode_refresh_token.exp]
    )

    return { access_token: new_access_token, refresh_token: new_refresh_token }
  }

  async verifyEmail(user_id: string) {
    // Tạo access token và refresh token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify: userVerificationStatus.Verified
    })

    // Cập nhật trạng thái xác minh email của người dùng trong cơ sở dữ liệu
    await databaseServices.query(
      `UPDATE users SET email_verification_token = '', verify = $2, updated_at = NOW() WHERE id = $1`,
      [user_id, userVerificationStatus.Verified]
    )

    // Giải mã refresh token
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    // Thêm refresh token vào bảng refresh_tokens
    await databaseServices.query(`INSERT INTO refresh_tokens (user_id, token, iat, exp) VALUES ($1, $2, $3, $4)`, [
      user_id,
      refresh_token,
      iat,
      exp
    ])

    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: userVerificationStatus.Verified
    })

    console.log('Resend email verify token : ', email_verify_token)

    // cập nhật email_verification_token người dùng
    await databaseServices.query(
      `UPDATE users
       SET email_verification_token = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [email_verify_token, user_id]
    )

    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY
    }
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id,
      verify
    })

    // Truy vấn PostgreSQL để cập nhật người dùng
    await databaseServices.query(
      `UPDATE users
       SET forgot_password_token = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [forgot_password_token, user_id]
    )

    // Gửi email chứa link reset password đến email của user ví dụ (nhưng mà chưa làm được nên còn sơ lốc vậy ...):
    //http://localhost:3000/forgot-password?token=forgot_password_token
    console.log('Forgot password token : ', forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
}

const usersService = new UsersService()

export default usersService
