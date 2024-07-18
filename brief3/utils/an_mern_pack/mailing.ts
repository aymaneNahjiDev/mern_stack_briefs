import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER_ADDRESS,
        pass: process.env.EMAIL_SENDER_PASSWORD,
    },
})

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(params:{to:string | string[];subject:string,body:string}) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SENDER_ADDRESS, // sender address
      to: params.to, // list of receivers
      subject:params.subject, // Subject line
    //   text: "Hello world?", // plain text body
      html: `
        <div>
        ${params.body}
        </div>
      `, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    return info
  }
  
  