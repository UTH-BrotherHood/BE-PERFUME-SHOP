import { Pool } from 'pg'
import { config } from 'dotenv'

config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

class UsersService {
  async register({ email, username, password }: { email: string; username: string; password: string }) {
    // Hash the password

    // Insert user into the database
    const result = await pool.query(
      `INSERT INTO users (username, password , email) VALUES ($1, $2, $3) RETURNING id, username`,
      [email, username, password]
    )

    return result.rows[0]
  }
}

const usersService = new UsersService()

export default usersService
