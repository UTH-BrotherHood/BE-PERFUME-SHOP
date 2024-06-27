import { ErrorWithStatus } from '~/models/errors'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES } from '~/constants/messages'

class DashboardService {
  async getCategory() {
    const query = `
        SELECT 
            (SELECT SUM(o.total_price) FROM orders o) AS total_revenue,
            (SELECT SUM(oi.quantity) FROM order_item oi INNER JOIN orders o ON oi.order_id = o.id) AS total_products_sold,
            (SELECT COUNT(*) FROM orders) AS total_orders
    `
    const result = await databaseServices.query(query)
    return result.rows[0] // Assuming the query returns a single row
  }
}

const dashboardService = new DashboardService()
export default dashboardService
