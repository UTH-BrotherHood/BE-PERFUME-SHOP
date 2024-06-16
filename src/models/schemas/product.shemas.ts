interface ProductType {
  id?: string
  category_id: string
  name: string
  description: string
  discount: number
  images: string[]
  stock: number
  price: number
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  id?: string
  category_id: string
  name: string
  description: string
  discount: number
  images: string[]
  stock: number
  price: number
  created_at?: Date
  updated_at?: Date
  constructor(Product: ProductType) {
    const date = new Date()
    this.id = Product.id
    this.category_id = Product.category_id
    this.name = Product.name
    this.description = Product.description || ''
    this.discount = Product.discount || 0
    this.images = Product.images || []
    this.stock = Product.stock || 0
    this.price = Product.price || 0
    this.created_at = Product.created_at || date
    this.updated_at = Product.updated_at || date
  }
}
