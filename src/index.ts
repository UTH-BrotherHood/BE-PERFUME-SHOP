import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import databaseServices from '~/services/database.services'
import usersRouters from '~/routes/users.routes'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import categoriesRouter from './routes/categories.routes'
import productsRouters from './routes/products.routes'
import wishlistRouters from './routes/wishlist.routes'
import cartsRouters from './routes/carts.routes'
import ordersRouters from './routes/orders.routes'

config()
// const databaseServices
databaseServices.connect()

const app = express()
app.use(cors())
const port = process.env.PORT || 4000
// Middlewares for parsing body
app.use(express.json())
// Routes for users
app.use('/users', usersRouters)
// Routes for categories
app.use('/categories', categoriesRouter)
// Routes for products
app.use('/products', productsRouters)
// Routes for wishlist
app.use('/wishlist', wishlistRouters)
// Routes for cart
app.use('/cart', cartsRouters)
// Routes for orders
app.use('/orders', ordersRouters)
// Error handler
app.use(defaultErrorHandler)
// Health check
app.use('/health', (req, res) => {
  res.send(`dope shit man, i'm still alive`)
})
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
