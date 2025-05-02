import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Email Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,  // false for TLS (587), true for SSL (465)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"💸 FinTrackr" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${to}`);

    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

export default sendEmail;
