import { AuthModel } from '../models'
import { IAuth } from '../models/Auth-model'

interface NewUserProps {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  phoneNumber: string
}
// Dealing with data base operations
class CustomerRepository {
  async AddUser({
    firstName,
    lastName,
    password,
    email,
    phoneNumber,
    userName
  }: NewUserProps): Promise<IAuth> {
    const User = new AuthModel({
      firstName,
      lastName,
      password,
      email,
      phoneNumber,
      userName
    })

    const AuthResult = await User.save()
    return AuthResult
  }

  async FindUser({
    emailOrPhoneNumber
  }: {
    emailOrPhoneNumber: string
  }): Promise<IAuth | null> {
    const user = await AuthModel.findOne({
      $or: [{ email: emailOrPhoneNumber }, { phone: emailOrPhoneNumber }]
    }).exec()
    return user
  }
}

export default CustomerRepository
