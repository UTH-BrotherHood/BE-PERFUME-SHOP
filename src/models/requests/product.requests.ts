export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  discount: number
  images: string[]
  stock: number
  price: number
}
