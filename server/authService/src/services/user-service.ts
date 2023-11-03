import UserRepository from '@/database/repository/user-repository'
import { revokeRefreshToken, signAccessToken, signRefreshToken } from '../utils'

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
    this.repository = new UserRepository()
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
