import { AuthModel, EmailOTPModel } from '../models'
import { IAuth } from '../models/Auth-model'
import { IEmailOTP } from '../models/OTP-model'

interface NewUserProps {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  phoneNumber: string
}
// Dealing with data base operations
class AuthRepository {
  async AddUser({
    firstName,
    lastName,
    password,
    email,
    phoneNumber,
    userName
  }: NewUserProps): Promise<IAuth | null> {
    const isExistingUser = await this.FindUser({
      emailOrPhoneNumber: email ?? phoneNumber
    })

    if (!isExistingUser) {
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
    return null
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

  async FindUserOTP({ email }: { email: string }): Promise<IEmailOTP | null> {
    const user = await EmailOTPModel.findOne({ email }).exec()
    return user
  }
  async FindUserOTPByID(id: string): Promise<IEmailOTP | null> {
    const user = await EmailOTPModel.findById(id).exec()
    return user
  }

  async AddUserOTP({ email, otp }: { email: string; otp: number }) {
    const hasOTP = await this.FindUserOTP({ email })

    if (!hasOTP) {
      const EmailOTP = new EmailOTPModel({
        email,
        emailOTP: otp
      })

      const EmailOTPResult = await EmailOTP.save()
      return EmailOTPResult
    }

    if (hasOTP && !hasOTP?.verified) {
      hasOTP.emailOTP = otp.toString()
      const EmailOTPResult = await hasOTP.save()
      return EmailOTPResult
    }
  }
}

export default AuthRepository
