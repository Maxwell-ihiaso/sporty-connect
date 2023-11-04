import nodemailer from 'nodemailer'
import { EMAIL_PASSWORD, FROM_EMAIL } from '@/config'
import { Response } from 'express'
import { getEmailTemplate } from '@/store/email-store'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: EMAIL_PASSWORD
  }
})

export enum EMAIL_TYPE {
  SEND_EMAIL_OTP = 'SEND_EMAIL_OTP',
  SEND_WELCOME_EMAIL = 'SEND_WELCOME_EMAIL'
}

export interface EmailDataProps {
  emailType: string
  from?: string
  to: string
  firstName: string
}
// All Business logic will be here
export default class EmailService {
  async SendWelcomeMail(
    { emailType, to, firstName }: EmailDataProps,
    res: Response
  ) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: FROM_EMAIL,
      to,
      subject: getEmailTemplate(emailType)(firstName).subject,
      html: getEmailTemplate(emailType)(firstName).message
    }

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error)
        return res
          .status(500)
          .json({ message: 'Unable to send email to ' + to })
      } else {
        console.log('Email Sent')
        return res.status(200).json({ message: 'Email sent!' })
      }
    })
  }

  async SendEmailOTP(
    { emailType, to, firstName, otp }: EmailDataProps & { otp: number },
    res: Response
  ) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: FROM_EMAIL,
      to,
      subject: getEmailTemplate(emailType)(firstName, otp).subject,
      html: getEmailTemplate(emailType)(firstName, otp).message
    }

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error)
        return res
          .status(500)
          .json({ message: 'Unable to send email to ' + to })
      } else {
        console.log('Email Sent')
        return res.status(200).json({ message: 'Email sent!' })
      }
    })
  }

  async SubscribeEvents(payload: {
    event: string
    userData: EmailDataProps & { otp: number }
    res: Response
  }) {
    const { event, userData, res } = payload

    const { emailType, firstName, to, from, otp } = userData

    switch (event) {
      case EMAIL_TYPE.SEND_EMAIL_OTP:
        this.SendEmailOTP(
          {
            emailType,
            firstName,
            to,
            from,
            otp
          },
          res
        )
        break
      case EMAIL_TYPE.SEND_WELCOME_EMAIL:
        this.SendWelcomeMail(
          {
            emailType,
            firstName,
            to,
            from
          },
          res
        )
        break

      default:
        break
    }
  }
}
