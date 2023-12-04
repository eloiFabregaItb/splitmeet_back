import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL, 
      pass: process.env.SMTP_KEY  
    }
});

export async function sendEmail(templatePath, usr_mail, subject, templateData) {
    try {
        const mailOptions = {
            from: 'SplitMeet',
            to: usr_mail.toLowerCase(), 
            subject: subject,
            inReplyTo: null,
            references: null
        };

        const emailTemplate = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = ejs.compile(emailTemplate);
        const html = compiledTemplate(templateData);
        mailOptions.html = html;

        const info = transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
