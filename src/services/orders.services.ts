import { ORDERS_MESSAGES } from '~/constants/messages'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import { ErrorWithStatus } from '~/models/errors'
import HTTP_STATUS from '~/constants/httpStatus'

class OrdersService {
  async createOrder({ user_id, address_id, payment_id }: { user_id: string; address_id: string; payment_id: string }) {
    const order_id = uuidv4()
    // Lấy danh sách sản phẩm trong giỏ hàng
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
    const productsInCartList = await databaseServices.query(
      `SELECT 
        products.id, 
        products.name, 
        products.price, 
        products.discount, 
        products.stock, 
        carts.quantity
      FROM 
        carts 
      JOIN 
        products 
      ON 
        carts.product_id = products.id
      WHERE 
        user_id = $1;`,
      [user_id]
    )
    const total_price = Number(totalPrice.rows[0].total_price)
    // Tạo order
    const result = await databaseServices.query(
      `INSERT INTO orders (id, user_id, address_id, payment_id, total_price, order_date)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *;`,
      [order_id, user_id, address_id, payment_id, total_price]
    )
    // Tạo order_item
    productsInCartList.rows.map(async (product: any) => {
      const order_item_id = uuidv4()
      await databaseServices.query(
        `INSERT INTO order_item (id, order_id, product_id, quantity, price, discount)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`,
        [order_item_id, order_id, product.id, product.quantity, product.price, product.discount]
      )
    })

    // Xóa sản phẩm trong giỏ hàng
    await databaseServices.query(`DELETE FROM carts WHERE user_id = $1`, [user_id])

    return result.rows[0]
  }
}

const ordersService = new OrdersService()
export default ordersService
