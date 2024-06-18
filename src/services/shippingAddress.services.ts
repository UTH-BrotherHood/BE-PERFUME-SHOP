import { ShippingAddressReqBody } from '~/models/requests/shippingAddress.requests'
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

  async getShippingAddressDetails(user_id: string, address_id: string) {
    const result = await databaseServices.query(`SELECT * FROM shipping_address WHERE id = $1 and user_id = $2;`, [
      address_id,
      user_id
    ])
    return result.rows[0]
  }

  async getShippingAddress(user_id: string) {
    const result = await databaseServices.query(`SELECT * FROM shipping_address WHERE user_id = $1;`, [user_id])
    return result.rows
  }

  async updateShippingAddress(user_id: string, address_id: string, payload: ShippingAddressReqBody) {
    // Lấy thông tin hiện tại của địa chỉ giao hàng
    const currentAddress = await databaseServices.query(`SELECT * FROM shipping_address WHERE id = $1`, [address_id])

    if (currentAddress.rows.length === 0) {
      throw new Error('Address not found')
    }

    const address = currentAddress.rows[0]
    // Cập nhật các trường chỉ nếu chúng có giá trị trong payload
    const updatedAddresst = {
      full_name: payload.full_name !== undefined ? payload.full_name : address.full_name,
      phone_number: payload.phone_number !== undefined ? payload.phone_number : address.phone_number,
      address_line: payload.address_line !== undefined ? payload.address_line : address.address_line,
      city: payload.city !== undefined ? payload.city : address.city,
      country: payload.country !== undefined ? payload.country : address.country
    }
    const result = await databaseServices.query(
      `UPDATE shipping_address
       SET full_name = $1, phone_number = $2, address_line = $3, city = $4, country = $5
       WHERE id = $6 and user_id = $7
       RETURNING *;`,
      [
        updatedAddresst.full_name,
        updatedAddresst.phone_number,
        updatedAddresst.address_line,
        updatedAddresst.city,
        updatedAddresst.country,
        address_id,
        user_id
      ]
    )
    return result.rows[0]
  }
}

const shippingAddressService = new ShippingAddressService()
export default shippingAddressService
