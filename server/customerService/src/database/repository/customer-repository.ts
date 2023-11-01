import { CustomerModel, AddressModel } from '../models'
import { type IAddress } from '../models/Address-model'
import {
  type ICartProduct,
  type ICustomer,
  type IOrder,
  type IProduct,
  type IWishList
} from '../models/Customer-model'

// Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone }: any): Promise<ICustomer> {
    const customer = new CustomerModel({
      email,
      password,
      phone,
      address: [],
      cart: [],
      wishlist: [],
      orders: []
    })

    const customerResult = await customer.save()
    return customerResult
  }

  async Address(customerId: string): Promise<IAddress[] | undefined> {
    const profile = await this.FindCustomerById(customerId)

    return profile?.address
  }

  async CreateAddress({
    _id,
    street,
    postalCode,
    city,
    country
  }: any): Promise<IAddress | null> {
    const profile = await CustomerModel.findById(_id)

    if (profile != null) {
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country
      })

      const customerAddress = await newAddress.save()
      profile.address.push(customerAddress._id)
      await profile.save()
      return customerAddress
    }

    return null
  }

  async FindCustomer({ email }: any): Promise<ICustomer | null> {
    const existingCustomer = await CustomerModel.findOne({ email })
      .populate('address')
      .exec()
    return existingCustomer
  }

  async FindCustomerById(id: string): Promise<ICustomer | null> {
    const existingCustomer = await CustomerModel.findById(id)
      .populate('address')
      .exec()
    return existingCustomer
  }

  async FindAllCustomers(): Promise<ICustomer[]> {
    const existingCustomers = await CustomerModel.find().exec()
    return existingCustomers
  }

  async Wishlist(customerId: string): Promise<IWishList[] | undefined> {
    const profile = await CustomerModel.findById(customerId).exec()

    return profile?.wishlist
  }

  async AddOrRemoveWishlistItem(
    customerId: string,
    { _id, name, description, price, available, banner }: IWishList
  ): Promise<IWishList[] | undefined> {
    const product = {
      _id,
      name,
      description,
      price,
      available,
      banner
    }

    const profile = await CustomerModel.findById(customerId).exec()

    if (profile != null) {
      const wishlist = profile.wishlist

      if (wishlist.length > 0) {
        let isExist = false

        for (const [index, item] of wishlist.entries()) {
          if (item._id.toString() === product._id.toString()) {
            isExist = true
            wishlist.splice(index, 1)
            break
          }
        }

        if (!isExist) {
          wishlist.push(product as IWishList)
        }
      } else {
        wishlist.push(product as IWishList)
      }

      profile.wishlist = wishlist
    }

    const profileResult = await profile?.save()

    return profileResult?.wishlist
  }

  async Cart(customerId: string): Promise<ICartProduct[] | undefined> {
    const profile = await CustomerModel.findById(customerId).exec()

    return profile?.cart
  }

  async AddOrRemoveCartItem(
    customerId: string,
    { _id, name, price, banner }: IProduct,
    qty: number,
    isRemove: boolean
  ): Promise<ICartProduct[] | undefined> {
    const profile = await CustomerModel.findById(customerId).exec()

    if (profile != null) {
      const cartItem = {
        product: { _id, name, price, banner },
        unit: qty
      }

      const cartItems = profile.cart

      if (cartItems.length > 0) {
        let isExist = false

        for (const [index, item] of cartItems.entries()) {
          if (item.product._id.toString() === _id.toString()) {
            isExist = true

            if (isRemove) {
              cartItems.splice(index, 1)
              break
            } else {
              item.unit = qty
              break
            }
          }
        }

        if (!isExist) {
          cartItems.push(cartItem as ICartProduct)
        }
      } else {
        cartItems.push(cartItem as ICartProduct)
      }

      profile.cart = cartItems
    }
    const cartResult = await profile?.save()
    return cartResult?.cart
  }

  async Orders(customerId: string): Promise<IOrder[] | undefined> {
    const profile = await CustomerModel.findById(customerId).exec()

    return profile?.orders
  }

  async AddOrderToProfile(
    customerId: string,
    order: IOrder
  ): Promise<ICustomer | undefined> {
    const profile = await CustomerModel.findById(customerId).exec()

    if (profile != null) {
      profile.orders.push(order)

      profile.cart = []
    }
    const profileResult = await profile?.save()

    return profileResult
  }
}

export default CustomerRepository
