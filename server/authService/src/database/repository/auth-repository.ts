import { AuthModel, EmailOTPModel, PhoneOTPModel } from '../models'
import { IAuth } from '../models/Auth-model'
import { IEmailOTP } from '../models/OTP-model'
import { IPhoneOTP } from '../models/PhoneOtp-model'

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
      $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }]
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

  async FindPhoneOTP({
    phoneNumber
  }: {
    phoneNumber: string
  }): Promise<IPhoneOTP | null> {
    const user = await PhoneOTPModel.findOne({ phone: phoneNumber }).exec()
    return user
  }

  async FindPhoneOTPByID(id: string): Promise<IPhoneOTP | null> {
    const user = await PhoneOTPModel.findById(id).exec()
    return user
  }

  async AddPhoneOTP({
    phoneNumber,
    otp
  }: {
    phoneNumber: string
    otp: number
  }) {
    const hasOTP = await this.FindPhoneOTP({ phoneNumber })

    if (!hasOTP) {
      const phoneNumberOTP = new PhoneOTPModel({
        phone: phoneNumber,
        phoneOTP: otp
      })

      const phoneNumberOTPResult = await phoneNumberOTP.save()
      return phoneNumberOTPResult
    }

    if (hasOTP && !hasOTP?.verified) {
      hasOTP.phoneOTP = otp.toString()
      const phoneNumberOTPResult = await hasOTP.save()
      return phoneNumberOTPResult
    }
  }
}

export default AuthRepository
