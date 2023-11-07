import { EMAIL_TYPE } from '@/services/email-services'

export const getEmailTemplate = (event: string) => {
  if (!event) throw new Error(`Invalid event received: ${event}`)

  const emailTemplate: {
    [key: string]: (
      firstName?: string,
      otp?: number,
      passwordResetToken?: string
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
    <p class="note">Please use this code to verify your identity. OTP i svalid for only one (1) hour.</p>
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
    <p>We would use the information you provide to us as well as your preferences to keep you connected and updated.</p>
    <div class="otp-code">Sporty Connetz<div>
    <p class="footer">Please reply to this email if you have concerns or need more information about Sporty Connectz.</p>
    <p class="footer">We are 100% data compliant</p>
  </div>
</body>
</html>
`
    }),
    [EMAIL_TYPE.SEND_PASSWORD_RESET_LINK]: (
      firstName?: string,
      otp?: number,
      passwordResetToken?: string
    ) => ({
      subject: 'Reset Password to Sporty Connetz',
      message: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Sporty-Connetz</title>
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
    <h1>A password reset link has been requested for your Sporty Connetz account</h1>
    <p>Dear ${firstName ?? 'User'},</p>
    <p>A password reset link has been requested for your Sporty Connetz account. If you did not request this, please ignore this message.</p>
    <p>Click the link below to reset your password</p>
    <div><a href="http://localhost:3000/auth/reset-password/${passwordResetToken}" target="_blank"><button>CLICK HERE </button></a><span> to reset your password</span></div>
    <p>Token expires in 30 minutes</p>
    <div class="otp-code">Sporty Connetz<div>
    <p class="footer">We are 100% data compliant. Please do not reply to this email. This is an autogenerated email.</p>
  </div>
</body>
</html>
`
    }),
    [EMAIL_TYPE.SEND_PASSWORD_UPDATE_SUCCESS]: (firstName?: string) => ({
      subject: 'Password Updated - Sporty Connetz',
      message: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Updated - Sporty-Connetz</title>
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
    <h1>Password Updated Successful!</h1>
    <p>Dear ${firstName ?? 'User'},</p>
    <p>Your password has been updated successfully. You may proceed to log in to your sporty Connectx account.</p>
    <p>Click the link below to login with your new passowrd</p>
    <div><a href="http://localhost:3000/auth/sign-in" target="_blank"><button>CLICK HERE </button></a><span> to log in</span></div>
s    <div class="otp-code">Sporty Connetz<div>
    <p class="footer">We are 100% data compliant. Please do not reply to this email. This is an autogenerated email.</p>
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

  return (firstName?: string, otp?: number, passwordResetToken?: string) =>
    template(firstName, otp, passwordResetToken)
}
