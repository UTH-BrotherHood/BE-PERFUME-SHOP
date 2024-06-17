export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  discount: number
  images: string[]
  stock: number
  price: number
}

export interface UpdateProductReqBody {
  category_id?: string
  name?: string | undefined
  description?: string
  discount?: number
  images?: string[]
  stock?: number
  price?: number
}
