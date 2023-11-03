import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  email: string
  userName: string
  firstName: string
  lastName: string
  phoneNumber: string
  image: string
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, toLowerCase: true },
    lastName: { type: String, toLowerCase: true },
    email: { type: String, toLowerCase: true },
    phoneNumber: String,
    userName: String,
    image: {
      type: String,
      default: 'https://img.freepik.com/free-icon/user_318-563642.jpg'
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v
      }
    },
    timestamps: true
  }
)

const UserModel: Model<IUser> = mongoose.model<IUser>('user', UserSchema)

export default UserModel
