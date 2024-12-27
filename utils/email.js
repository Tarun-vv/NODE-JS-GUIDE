const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // NOTE: create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // NOTE: define email options
  const mailOptions = {
    from: 'tarun <tarunv1911@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: NOTE: LATER
  };

  // NOTE: send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
