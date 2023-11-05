import mongoose, { type Document, type Model, Schema } from 'mongoose'
import { GeneratePassword, GenerateSalt, ValidatePassword } from '../../utils'

export interface IPhoneOTP extends Document {
  _id: string
  phone: string
  phoneOTP: string
  verified: boolean
  createdAt: Date
  expiresAt: Date
  isValidOTP: (phoneOTP: string) => Promise<boolean>
}

const PhoneOTPSchema = new Schema<IPhoneOTP>({
  phone: { type: String, lowercase: true, unique: true, required: true },
  phoneOTP: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + 60 * 60 * 1000 }
})

PhoneOTPSchema.pre('save', async function (next) {
  if (!this.isModified('phoneOTP')) return next()

  const hash = await GenerateSalt(10)
  const hashedOTP = await GeneratePassword(this.phoneOTP, hash)
  this.phoneOTP = hashedOTP
  next()
})

PhoneOTPSchema.methods.isValidOTP = async function (phoneOTP: string) {
  return await ValidatePassword(phoneOTP, this.phoneOTP)
}

const PhoneOTPModel: Model<IPhoneOTP> = mongoose.model<IPhoneOTP>(
  'phoneotp',
  PhoneOTPSchema
)

export default PhoneOTPModel
