import { publishEmailEvent, revokeRefreshToken, signAccessToken, signRefreshToken } from '../utils'
import SendOtp from 'sendotp'
import AuthRepository from '@/database/repository/auth-repository'

interface SignInReturnProps {
  id: string
  accessToken: string
  refreshToken: string
}

export interface UserDataProps {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  userName: string
}
// All Business logic will be here
export default class AuthService {
  private readonly repository

  public constructor() {
    this.repository = new AuthRepository()
  }

  async SignIn(userInputs: {
    emailOrPhone: string
    password: string
  }): Promise<SignInReturnProps | null> {
    const { emailOrPhone, password } = userInputs

    const existingCustomer = await this.repository.FindUser({
      emailOrPhoneNumber: emailOrPhone
    })

    if (existingCustomer) {
      const validPassword = await existingCustomer.isValidPassword(password)

      if (validPassword) {
        const accessToken = await signAccessToken(existingCustomer._id)
        const refreshToken = await signRefreshToken(existingCustomer._id)
        return {
          id: existingCustomer._id,
          accessToken,
          refreshToken
        }
      }
      return null
    }
    return null
  }

  async SignOut(userId: string) {
    await revokeRefreshToken(userId)
  }

  async VerifyEmailOTP(email: string, otp: number) {
    const isOTPRequested = await this.repository.FindUserOTP({ email })

    if (isOTPRequested) {
      const validOTP = await isOTPRequested.isValidOTP(otp)

      if (validOTP) {
        return {
          message: 'Email has been verified',
          status: 'success'
        }
      }
      return null
    }
    return null
  }

  private async GenerateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp.toString() // Convert to string for consistency
  }

  async ValidateEmail(email: string) {
    const isOTPRequested = await this.repository.FindUserOTP({ email })

    if (isOTPRequested) {
      return {
        message: 'Check your email for OTP',
        status: 'success'
      }
    }
    const OTP = await this.GenerateOTP()
    const isSavedOTP = await this.repository.AddUserOTP({ email, otp: Number(OTP) })

    if (isSavedOTP) {
      publishEmailEvent({})

    }
  }

  async SignUp(userData: UserDataProps) {
    const { firstName, lastName, email, password, phoneNumber, userName } =
      userData

    return this.repository.AddUser({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userName
    })
  }

  // async SendPhoneOTP({ contactNumber, to, firstName, otp }, res: Response) {
  //   const sendOtp = new SendOtp('AuthKey')

  //   sendOtp.send(contactNumber, senderId, callback) //otp is optional if not sent it'll be generated automatically
  //   sendOtp.retry(contactNumber, retryVoice, callback)
  //   sendOtp.verify(contactNumber, otpToVerify, callback)
  // }

  async SubscribeEvents(payload: { event: string; userData: UserDataProps }) {
    const { event, userData } = payload

    const { firstName, lastName, email, password, phoneNumber, userName } =
      userData

    switch (event) {
      case 'ADD_USER':
        this.SignUp({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          userName
        })
        break

      default:
        break
    }
  }
}
