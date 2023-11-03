import { type IAddress } from '@/database/models/Address-model'
import { CustomerRepository } from '../database'
import { revokeRefreshToken, signAccessToken, signRefreshToken } from '../utils'
import {
  IProduct,
  type ICartProduct,
  type ICustomer,
  type IOrder,
  type IWishList
} from '@/database/models/Customer-model'

// All Business logic will be here
export default class CustomerService {
  private readonly repository

  public constructor() {
    this.repository = new CustomerRepository()
  }

  async SignIn(userInputs: { email: string; password: string }): Promise<{
    id: string
    roles: number[]
    accessToken: string
    refreshToken: string
  } | null> {
    const { email, password } = userInputs

    const existingCustomer = await this.repository.FindCustomer({ email })

    if (existingCustomer != null) {
      const validPassword = await existingCustomer.isValidPassword(password)

      if (validPassword) {
        const accessToken = await signAccessToken(
          existingCustomer._id,
          existingCustomer.roles
        )
        const refreshToken = await signRefreshToken(
          existingCustomer._id,
          existingCustomer.roles
        )
        return {
          id: existingCustomer._id,
          roles: existingCustomer.roles,
          accessToken,
          refreshToken
        }
      }
      return null
    }
    return null
  }

  async SignOut(userId: string) {
    await revokeRefreshToken(userId)
  }

  async SignUp(userInputs: {
    email: string
    password: string
    phone: string
  }): Promise<{
    id: string
    roles: number[]
  } | null> {
    const { email, password, phone } = userInputs
    const existingCustomer = await this.repository.FindCustomer({ email })

    if (existingCustomer == null) {
      const customerResult = await this.repository.CreateCustomer({
        email,
        password,
        phone
      })

      return { id: customerResult._id, roles: customerResult.roles }
    }
    return null
  }

  async GetAddress(customerId: string): Promise<IAddress[] | undefined> {
    const Address = await this.repository.Address(customerId)
    return Address
  }

  async AddNewAddress(
    _id: string,
    userInputs: {
      street: string
      postalCode: any
      city: string
      country: string
    }
  ): Promise<IAddress | null> {
    const { street, postalCode, city, country } = userInputs

    const addressResult = await this.repository.CreateAddress({
      _id,
      street,
      postalCode,
      city,
      country
    })

    return addressResult
  }

  async GetProfileByEmail(email: string): Promise<ICustomer | null> {
    const existingCustomer = await this.repository.FindCustomer({ email })
    return existingCustomer
  }

  async GetAllUsers(): Promise<ICustomer[] | null> {
    const existingCustomers = await this.repository.FindAllCustomers()
    return existingCustomers
  }

  async GetProfileById(id: string): Promise<ICustomer | null> {
    const existingCustomer = await this.repository.FindCustomerById(id)
    return existingCustomer
  }

  // Revisit shopping details
  async GetShopingDetails(id: string): Promise<ICustomer | null> {
    const existingCustomer = await this.repository.FindCustomerById(id)

    // const orders = await this.shopingRepository.Orders(id);
    return existingCustomer
  }

  async GetWishList(customerId: string): Promise<IWishList[] | undefined> {
    const wishListItems = await this.repository.Wishlist(customerId)
    return wishListItems
  }

  async AddOrRemoveWishlist(
    customerId: string,
    product: IWishList
  ): Promise<IWishList[] | undefined> {
    const wishlistResult = await this.repository.AddOrRemoveWishlistItem(
      customerId,
      product
    )
    return wishlistResult
  }

  async GetCart(customerId: string): Promise<ICartProduct[] | undefined> {
    const cart = await this.repository.Cart(customerId)
    return cart
  }

  async ManageCart(
    customerId: string,
    product: any,
    qty: number,
    isRemove: boolean
  ): Promise<ICartProduct[] | undefined> {
    const cartResult = await this.repository.AddOrRemoveCartItem(
      customerId,
      product,
      qty,
      isRemove
    )
    return cartResult
  }

  async GetOrders(customerId: string): Promise<IOrder[] | undefined> {
    const orders = await this.repository.Orders(customerId)
    return orders
  }

  async ManageOrder(
    customerId: string,
    order: IOrder
  ): Promise<ICustomer | undefined> {
    const orderResult = await this.repository.AddOrderToProfile(
      customerId,
      order
    )
    return orderResult
  }

  async SubscribeEvents(payload: any) {
    const { event, data } = payload

    const { userId, product, order, qty } = data

    switch (event) {
      case 'ADD_TO_WISHLIST':
      case 'REMOVE_FROM_WISHLIST':
        this.AddOrRemoveWishlist(userId, product)
        break
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false)
        break
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true)
        break
      case 'CREATE_ORDER':
        this.ManageOrder(userId, order)
        break
      default:
        break
    }
  }
}
