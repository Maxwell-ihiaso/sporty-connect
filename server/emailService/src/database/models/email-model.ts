import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface IEmail extends Document {
  _id: string
  emailType: string
  emailBody: string
  attachments: string[]
}

const EmailSchema = new Schema<IEmail>(
  {
    emailType: { type: String, toLowerCase: true, unique: true },
    emailBody: { type: String },
    attachments: [{ type: String }]
  },
  {
    timestamps: true
  }
)

const EmailModel: Model<IEmail> = mongoose.model<IEmail>('email', EmailSchema)

export default EmailModel
