import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'

class ShippingAddressService {
  async createShippingAddress({
    user_id,
    full_name,
    phone_number,
    address_line,
    city,
    country
  }: {
    user_id: string
    full_name: string
    phone_number: string
    address_line: string
    city: string
    country: string
  }) {
    const address_id = uuidv4()
    const result = await databaseServices.query(
      `INSERT INTO shipping_address (id, user_id, full_name, phone_number, address_line, city, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [address_id, user_id, full_name, phone_number, address_line, city, country]
    )
    return result.rows[0]
  }
}

const shippingAddressService = new ShippingAddressService()
export default shippingAddressService
