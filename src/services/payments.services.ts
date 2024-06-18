import { ErrorWithStatus } from '~/models/errors'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES } from '~/constants/messages'

class PaymentsService {
  async createPaymentMethod(user_id: string, payment_method: string) {
    const payment_id = uuidv4()
    const productsInCart = await databaseServices.query(`SELECT product_id FROM carts WHERE user_id = $1`, [user_id])
    if (productsInCart.rows.length === 0) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: ORDERS_MESSAGES.CART_IS_EMPTY
      })
    }
    // Lấy danh sách id của các sản phẩm trong giỏ hàng
    const productIds = productsInCart.rows.map((product: any) => product.product_id)
    // Tính tổng giá tiền của các sản phẩm trong giỏ hàng
    const totalPrice = await databaseServices.query(
      `SELECT 
         SUM(products.price * carts.quantity) AS total_price
       FROM 
         carts 
       JOIN 
         products 
       ON 
         carts.product_id = products.id
       WHERE 
         user_id = $1 
         AND carts.product_id = ANY($2);`,
      [user_id, productIds]
    )
    const total_price = Number(totalPrice.rows[0].total_price)
    const result = await databaseServices.query(
      `INSERT INTO payment (id, user_id, payment_method, amount, payment_date)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *;`,
      [payment_id, user_id, payment_method, total_price]
    )

    return result.rows[0]
  }
}

const paymentsService = new PaymentsService()
export default paymentsService
