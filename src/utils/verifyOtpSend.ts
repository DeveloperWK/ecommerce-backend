import { configDotenv } from 'dotenv';
import nodemailer from 'nodemailer';
configDotenv();
export const transporter = nodemailer.createTransport({
  service: 'smtp',
  auth: {
    user: process.env._SMTP_USERNAME,
    pass: process.env._SMTP_PASSWORD,
  },
  host: process.env._SMTP_HOST,
  port: Number(process.env._SMTP_PORT),
  secure: process.env._SMTP_SECURE === 'true',
});
const verifyOtpSend = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env._SMTP_USERNAME,
    to: email,
    subject: 'Verify Your Email',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 100px;
            margin-bottom: 20px;
        }
        h2 {
            color: #333;
        }
        p {
            font-size: 16px;
            color: #555;
        }
        .otp {
            font-size: 22px;
            font-weight: bold;
            color: #007bff;
            background: #f1f8ff;
            display: inline-block;
            padding: 10px 20px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://yourlogo.com/logo.png" alt="Your Logo" class="logo">
        <h2>Verify Your Email</h2>
        <p>Your OTP code for verification is:</p>
        <div class="otp">${otp}</div>
        <p>Please use this code to complete your verification. The OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
            <p>Need help? <a href="mailto:support@yourwebsite.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
`,
  });
};

export default verifyOtpSend;
