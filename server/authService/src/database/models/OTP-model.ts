import mongoose, { type Document, type Model, Schema } from 'mongoose'
import { GeneratePassword, GenerateSalt, ValidatePassword } from '../../utils'

export interface IEmailOTP extends Document {
  _id: string
  email: string
  emailOTP: string
  verified: boolean
  createdAt: Date
  expiresAt: Date
  isValidOTP: (emailOTP: string) => Promise<boolean>
}

const EmailOTPSchema = new Schema<IEmailOTP>({
  email: { type: String, lowercase: true, unique: true, required: true },
  emailOTP: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + 60 * 60 * 1000 }
})

EmailOTPSchema.pre('save', async function (next) {
  if (!this.isModified('emailOTP')) return next()

  const hash = await GenerateSalt(10)
  const hashedOTP = await GeneratePassword(this.emailOTP, hash)
  this.emailOTP = hashedOTP
  next()
})

EmailOTPSchema.methods.isValidOTP = async function (emailOTP: string) {
  return await ValidatePassword(emailOTP, this.emailOTP)
}

const EmailOTPModel: Model<IEmailOTP> = mongoose.model<IEmailOTP>(
  'emailotp',
  EmailOTPSchema
)

export default EmailOTPModel
