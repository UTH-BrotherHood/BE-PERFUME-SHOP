import { Pool } from 'pg'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config()

class DatabaseServices {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    this.createTables()
  }

  async connect() {
    try {
      await this.pool.connect()
      console.log('Successfully connected to PostgreSQL database!')
    } catch (error) {
      console.error('Error connecting to the database', error)
      throw error
    }
  }
  async createTables() {
    try {
      // Đường dẫn đến thư mục chứa file create-tables.sql
      const createTablesSql = fs.readFileSync(path.resolve('src', 'models', 'sql', 'create-tables.sql'), 'utf-8')
      await this.pool.query(createTablesSql)
      console.log('Tables created successfully!')
    } catch (error) {
      console.error('Error creating tables:', error)
      throw error
    }
  }
  async query(text: string, params: any[]) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(text, params)
      return res
    } finally {
      client.release()
    }
  }
}

// Định nghĩa các phương thức khác cho các truy vấn cụ thể của bạn tại đây

const databaseServices = new DatabaseServices()

export default databaseServices
