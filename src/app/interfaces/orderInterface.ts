
import { ICartProduct } from './cartInterface';

export interface IOrderInterface {
  shippingAddress: IShippingAddress
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: IUser
  cartItems: ICartProduct[]
  paidAt?: string
  createdAt: string
  updatedAt: string
  id: number
  __v: number
}

export interface IShippingAddress {
  details: string
  phone: string
  city: string
}

export interface IUser {
  _id: string
  name: string
  email: string
  phone: string
}





