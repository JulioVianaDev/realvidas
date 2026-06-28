import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.realvidas.io',
  port: 587,
  secure: false,
  auth: {
    user: 'contact@realvidas.io',
    pass: 'tomate123',
  },
});

await transporter.sendMail({
  from: 'contact@realvidas.io',
  to: 'juliovianadev@gmail.com',
  subject: 'Primeiro acesso',
  text: 'Olá aqui está seu primeiro acesso a realvidas',
});
