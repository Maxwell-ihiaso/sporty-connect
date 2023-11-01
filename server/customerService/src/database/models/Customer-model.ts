import mongoose, { type Document, type Model, Schema } from 'mongoose'
import { GeneratePassword, GenerateSalt, ValidatePassword } from '../../utils'
import { type IAddress } from './Address-model'

export interface IProduct extends Document {
  _id: string
  name: string
  banner: string
  price: number
}

export interface ICartProduct extends Document {
  product: IProduct
  unit: number
}

export interface IWishList extends Document {
  _id: string
  name: string
  description: string
  banner: string
  available: boolean
  price: number
}

export interface IOrder extends Document {
  _id: string
  amount: string
  date: Date
}

export interface ICustomer extends Document {
  email: string
  password: string
  salt: string
  phone: string
  address: IAddress[]
  cart: ICartProduct[]
  wishlist: IWishList[]
  orders: IOrder[]
  roles: number[]
  image: string
  isValidPassword: (password: string) => Promise<boolean>
}

const WishListSchema = new Schema<IWishList>({
  _id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  banner: { type: String },
  available: { type: Boolean },
  price: { type: Number }
})

const ProductSchema = new Schema<IProduct>({
  _id: { type: String, required: true },
  name: { type: String },
  banner: { type: String },
  price: { type: Number }
})

const CartProductSchema = new Schema<ICartProduct>({
  product: { type: ProductSchema, required: true },
  unit: { type: Number, required: true }
})

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, required: true },
  amount: { type: String },
  date: { type: Date, default: Date.now() }
})

const CustomerSchema = new Schema<ICustomer>(
  {
    email: { type: String, toLowerCase: true },
    password: String,
    phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: 'address', required: true }],
    cart: [CartProductSchema],
    wishlist: [WishListSchema],
    orders: [OrderSchema],
    roles: {
      type: [Number],
      default: [2001]
    },
    image: {
      type: String,
      default: 'https://img.freepik.com/free-icon/user_318-563642.jpg'
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password
        delete ret.__v
      }
    },
    timestamps: true
  }
)

CustomerSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  if (!this.isModified('password')) return next()

  const hash = await GenerateSalt(10)
  const hashedPassword = await GeneratePassword(this.password, hash)
  this.password = hashedPassword
  next()
})

CustomerSchema.methods.isValidPassword = async function (password: string) {
  return await ValidatePassword(password, this.password)
}

const CustomerModel: Model<ICustomer> = mongoose.model<ICustomer>(
  'customer',
  CustomerSchema
)

export default CustomerModel
