import { Ipagination } from "./pagination"

export interface ICategoryResponse {
  results: number
  metadata: Ipagination
  data: ICategory[]
}


export interface ICategory {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}
