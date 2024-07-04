import { tokenType, userVerificationStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import { RegisterReqBody } from '~/models/requests/user.requests'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { v4 as uuidv4 } from 'uuid'
import User from '~/models/schemas/user.schemas'
import { USERS_MESSAGES } from '~/constants/messages'
import { envConfig } from '~/constants/config'
import { sendForgotPassWordEmail, sendVerifyRegisterEmail } from '~/utils/email'
class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken,
        verify
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        expiresIn: envConfig.jwtExpiresIn
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
        privateKey: envConfig.jwtSecretRefreshToken
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken,
        verify
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: {
        expiresIn: envConfig.jwtRefreshExpiresIn
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
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: {
        expiresIn: envConfig.jwtEmailVerifyExpiresIn
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
      privateKey: envConfig.jwtSecretForgotPassToken,
      options: {
        expiresIn: envConfig.jwtForgotPassExpiresIn
      }
    })
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: userVerificationStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublickey: envConfig.jwtSecretRefreshToken
    })
  }
  async register(payload: RegisterReqBody) {
    const user_id = uuidv4()
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
      `INSERT INTO users (id, username, email, password, email_verification_token, date_of_birth , verify )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user_id,
        user.name,
        user.email,
        hashed_password,
        email_verify_token,
        date_of_birth,
        userVerificationStatus.Unverified
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
    console.log(user.email, user.name)
    await sendVerifyRegisterEmail(user.email, user.name, email_verify_token)
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
    const user = await await databaseServices.query(
      `SELECT u.id, u.username, u.email, u.phone_number, u.date_of_birth, u.created_at, u.updated_at, u.verify, u.avatar,
              COALESCE(cart_totals.total_cart_quantity, 0) AS total_cart_quantity,
              COALESCE(wishlist_totals.total_wishlist_quantity, 0) AS total_wishlist_quantity
       FROM users u
       LEFT JOIN (
           SELECT user_id, SUM(quantity) AS total_cart_quantity
           FROM carts
           GROUP BY user_id
       ) cart_totals ON u.id = cart_totals.user_id
       LEFT JOIN (
           SELECT user_id, COUNT(product_id) AS total_wishlist_quantity
           FROM wish_list
           GROUP BY user_id
       ) wishlist_totals ON u.id = wishlist_totals.user_id
       WHERE u.id = $1`,
      [user_id]
    )

    const userInfo = user.rows[0]
    return { access_token, refresh_token, userInfo }
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

  async resendVerifyEmail(user_id: string, email: string, name: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: userVerificationStatus.Verified
    })
    await sendVerifyRegisterEmail(email, name, email_verify_token)
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

  async forgotPassword({
    user_id,
    verify,
    email,
    name
  }: {
    user_id: string
    verify: userVerificationStatus
    email: string
    name: string
  }) {
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
    sendForgotPassWordEmail(email, name, forgot_password_token)
    console.log('Forgot password token : ', forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    const hashed_password = hashPassword(password)

    await databaseServices.query(
      `UPDATE users
       SET password = $1,
           forgot_password_token = '',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashed_password, user_id]
    )

    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFULLY
    }
  }

  async getMe(user_id: string) {
    const userQuery = await databaseServices.query(
      `SELECT u.id, u.username, u.email, u.phone_number, u.date_of_birth, u.created_at, u.updated_at, u.verify, u.avatar,
              COALESCE(cart_totals.total_cart_quantity, 0) AS total_cart_quantity,
              COALESCE(wishlist_totals.total_wishlist_quantity, 0) AS total_wishlist_quantity
       FROM users u
       LEFT JOIN (
           SELECT user_id, SUM(quantity) AS total_cart_quantity
           FROM carts
           GROUP BY user_id
       ) cart_totals ON u.id = cart_totals.user_id
       LEFT JOIN (
           SELECT user_id, COUNT(product_id) AS total_wishlist_quantity
           FROM wish_list
           GROUP BY user_id
       ) wishlist_totals ON u.id = wishlist_totals.user_id
       WHERE u.id = $1`,
      [user_id]
    )

    return userQuery.rows[0]
  }

  async updateProfile(user_id: string, payload: any) {
    const { username, phone_number } = payload
    console.log('name : ', username)
    const result = await databaseServices.query(
      `UPDATE users
       SET username = $1,
           phone_number = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [username, phone_number, user_id]
    )

    return result.rows[0]
  }
}
const usersService = new UsersService()

export default usersService
