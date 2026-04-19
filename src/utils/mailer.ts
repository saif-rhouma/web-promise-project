import nodemailer from 'nodemailer';
import environment from '../configs/environment';

export const transporter = nodemailer.createTransport({
  service: environment.MAIL_SERVICE,
  host: environment.MAIL_HOST,
  port: environment.MAIL_PORT,
  secure: false,
  auth: {
    user: environment.MAIL_USER,
    pass: environment.MAIL_PASSWORD,
  },
});

interface ContactPayload {
  username: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
export const sendContactEmail = async (data: ContactPayload) => {
  const { username, email, phone, subject, message } = data;

  await transporter.sendMail({
    from: `"Contact Form" - <${email}>`,
    to: environment.DEFAULT_MAIL_APP,
    replyTo: email,

    subject: `📩 New Contact Message: ${subject}`,

    html: `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${username}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Subject:</b> ${subject}</p>
      <hr />
      <p>${message}</p>
    `,
  });
};
