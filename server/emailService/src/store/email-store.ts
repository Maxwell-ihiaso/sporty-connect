import { EMAIL_TYPE } from '@/services/email-services'

export const getEmailTemplate = (event: string) => {
  if (!event) throw new Error(`Invalid event received: ${event}`)

  const emailTemplate: {
    [key: string]: (
      firstName?: string,
      otp?: number
    ) => {
      subject: string
      message: string
    }
  } = {
    [EMAIL_TYPE.SEND_EMAIL_OTP]: (firstName?: string, otp?: number) => ({
      subject: 'OTP - Sporty Connetz',
      message: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sporty-Connetz OTP Verification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }

    h1 {
      color: #333333;
      margin-bottom: 20px;
    }

    p {
      color: #666666;
      margin-bottom: 30px;
    }

    .otp-code {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 20px;
    }

    .note {
      color: #999999;
      margin-bottom: 20px;
    }

    .footer {
      color: #777777;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Dear ${firstName ?? 'User'},</p>
    <p>Your One-Time Password (OTP) for email verification is:</p>
    <div class="otp-code">${otp}</div>
    <p class="note">Please use this code to verify your identity.</p>
    <p class="footer">This email is auto-generated. Please do not reply to this email.</p>
  </div>
</body>
</html>
`
    }),
    [EMAIL_TYPE.SEND_WELCOME_EMAIL]: (firstName?: string) => ({
      subject: 'Welcome to Sporty Connetz',
      message: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome - Sporty-Connetz</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }

    h1 {
      color: #333333;
      margin-bottom: 20px;
    }

    p {
      color: #666666;
      margin-bottom: 30px;
    }

    .otp-code {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 20px;
    }

    .note {
      color: #999999;
      margin-bottom: 20px;
    }

    .footer {
      color: #777777;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>We are delighted to have you join Sporty Connectz</h1>
    <p>Dear ${firstName ?? 'User'},</p>
    <p>Welcome to Sportz Connect!</p>
    <p>We are number one stop and greet place to get connected to sport lovers around the world. All you need is to stay connected to the platform, have a complete profile, and you are all set.</p>
    <p>We would use the ionformation you provide to us as well as your preferences to keep you connected and updated.</p>
    <div class="otp-code">Sporty Connetzdiv>
    <p class="note">Please reply to this email if you have concerns or need more information about Sporty Connectz.</p>
    <p class="footer">We are 100% data compliant</p>
  </div>
</body>
</html>
`
    })
  }

  const template = emailTemplate[event]
  if (!template) {
    throw new Error(`Invalid event: ${event}`)
  }

  return (firstName?: string, otp?: number) => template(firstName, otp)
}
