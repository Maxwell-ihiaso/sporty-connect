import {
  publishEmailEvent,
  revokeRefreshToken,
  signAccessToken,
  signRefreshToken
} from '../utils'
import SendOtp from 'sendotp'
import AuthRepository from '@/database/repository/auth-repository'
import { EMAIL_TYPE } from '@/api/auth-api'

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

  private async GenerateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp.toString() // Convert to string for consistency
  }

  async ValidateEmail(email: string) {
    const isOTPRequested = await this.repository.FindUserOTP({ email })

    if (isOTPRequested?.verified) {
      return { status: 403, message: 'Email is already verified', data: null }
    }
    const OTP = await this.GenerateOTP()
    const isSavedOTP = await this.repository.AddUserOTP({
      email,
      otp: Number(OTP)
    })

    if (isSavedOTP) {
      publishEmailEvent({
        event: EMAIL_TYPE.SEND_EMAIL_OTP,
        userData: {
          otp: Number(OTP),
          emailType: EMAIL_TYPE.SEND_EMAIL_OTP,
          to: email,
          firstName: 'User'
        }
      })

      return {
        message: 'Check your email for OTP',
        data: {
          userId: isSavedOTP._id
        },
        status: 200
      }
    }
  }

  async VerifyEmailOTP(userId: string, otp: number) {
    const isOTPRequested = await this.repository.FindUserOTPByID(userId)

    if (!isOTPRequested) return { status: 404, message: 'Incorrect user ID' }
    if (isOTPRequested.verified)
      return { status: 403, message: 'Email is already verified' }

    const validOTP = await isOTPRequested.isValidOTP(otp.toString())

    if (!validOTP) return { status: 400, message: 'Incorrect OTP' }

    if (isOTPRequested.expiresAt <= new Date())
      return { status: 403, message: 'OTP is expired' }
    isOTPRequested.verified = true
    await isOTPRequested.save()

    return {
      message: 'Email has been verified',
      status: 200
    }
  }

  async SignUp(userData: UserDataProps) {
    const { firstName, lastName, email, password, phoneNumber, userName } =
      userData

    const isVerifiedEmail = await this.repository.FindUserOTP({ email })

    if (!isVerifiedEmail || !isVerifiedEmail?.verified)
      return { status: 403, message: 'Email must be verified', data: null }

    const newUser = await this.repository.AddUser({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userName
    })

    if (!newUser)
      return {
        status: 403,
        data: null,
        message: 'Email or Phone Number has is already registered'
      }

    publishEmailEvent({
      event: EMAIL_TYPE.SEND_WELCOME_EMAIL,
      userData: {
        to: newUser?.email,
        emailType: EMAIL_TYPE.SEND_WELCOME_EMAIL,
        firstName: newUser?.firstName
      }
    })

    return { messgae: 'New user created', status: 200, data: newUser }
  }

  async SignIn(userInputs: { emailOrPhone: string; password: string }) {
    const { emailOrPhone, password } = userInputs

    const existingCustomer = await this.repository.FindUser({
      emailOrPhoneNumber: emailOrPhone
    })

    if (!existingCustomer)
      return { status: 401, message: 'Invalid email or phone', data: null }

    const validPassword = await existingCustomer.isValidPassword(password)

    if (!validPassword)
      return {
        status: 401,
        message: 'Invalid email/phone or password',
        data: null
      }

    const accessToken = await signAccessToken(existingCustomer._id)
    const refreshToken = await signRefreshToken(existingCustomer._id)

    return {
      status: 200,
      message: 'Sign in successful',
      data: {
        id: existingCustomer._id,
        accessToken,
        refreshToken
      }
    }
  }

  async SignOut(userId: string) {
    await revokeRefreshToken(userId)
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
