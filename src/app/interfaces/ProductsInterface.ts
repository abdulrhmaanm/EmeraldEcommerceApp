import { IBrand } from "./BrandInterface"
import { ICategory } from "./categoryInterface"
import { Ipagination } from "./pagination"
import { ISubcategory } from "./SubCategoryInterface"


export interface IProductResponse {
    
  results: number
  metadata: Ipagination
  data: IProduct[]
}


export interface IProduct {
  sold?: number
  images: string[]
  subcategory: ISubcategory[]
  ratingsQuantity: number
  _id: string
  title: string
  slug: string
  description: string
  quantity: number
  price: number
  imageCover: string
  category: ICategory
  brand: IBrand
  ratingsAverage: number
  createdAt: string
  updatedAt: string
  id: string
  priceAfterDiscount?: number
  availableColors?: string[]
}

