import EmailModel, { IEmail } from '../models/email-model'

interface NewEmailProps {
  emailType: string
  emailBody: string
  attachments: string[]
}
// Dealing with data base operations
class EmailRepository {
  async AddEmail({
    emailType,
    emailBody,
    attachments
  }: NewEmailProps): Promise<IEmail | null> {
    const isExistingEmail = await this.FindEmailType({
      emailType
    })

    if (!isExistingEmail) {
      const Email = new EmailModel({
        emailType,
        emailBody,
        attachments
      })

      const EmailResult = await Email.save()
      return EmailResult
    }
    return null
  }

  async FindEmailType({
    emailType
  }: {
    emailType: string
  }): Promise<IEmail | null> {
    const user = await EmailModel.findOne({
      emailType: emailType.toLowerCase()
    }).exec()
    return user
  }
}

export default EmailRepository
