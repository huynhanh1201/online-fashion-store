const brevo = require('@getbrevo/brevo')

import { env } from '~/config/environment'

let apiInstance = new brevo.TransactionalEmailsApi()

let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (
  username,
  recipientEmail,
  customSubject,
  customHtmlContent
) => {
  //   Khởi tạo một cái đối tượng SendSmtpEmail với thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản gửi email: lưu ý địa chỉ HeaderAdmin phải là cái email mà các bạn tạo tài khoản trên Brevo
  sendSmtpEmail.sender = {
    name: env.ADMIN_EMAIL_NAME,
    email: env.ADMIN_EMAIL_ADDRESS
  }

  // Danh sách người nhận email
  // sendSmtpEmail.to phải là một Array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail, name: username }]

  //   Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = customHtmlContent

  //   Gọi hành động gửi email

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
