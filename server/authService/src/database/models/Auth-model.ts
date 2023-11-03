import mongoose, { type Document, type Model, Schema } from 'mongoose'
import { GeneratePassword, GenerateSalt, ValidatePassword } from '../../utils'

export interface IAuth extends Document {
  _id: string
  firstName: string
  lastName: string
  userName: string
  phoneNumber: string
  email: string
  password: string
  isValidPassword: (password: string) => Promise<boolean>
}

const AuthSchema = new Schema<IAuth>(
  {
    firstName: { type: String, toLowerCase: true },
    lastName: { type: String, toLowerCase: true },
    email: { type: String, toLowerCase: true },
    password: String,
    phoneNumber: String
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

AuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hash = await GenerateSalt(10)
  const hashedPassword = await GeneratePassword(this.password, hash)
  this.password = hashedPassword
  next()
})

AuthSchema.methods.isValidPassword = async function (password: string) {
  return await ValidatePassword(password, this.password)
}

const AuthModel: Model<IAuth> = mongoose.model<IAuth>('auth', AuthSchema)

export default AuthModel
