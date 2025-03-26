import { transporter } from './verifyOtpSend.service';

const emailVerifiedSuccessMail = async (email: string) => {
  await transporter.sendMail({
    from: process.env._SMTP_USERNAME,
    to: email,
    subject: 'Email Verified Successfully',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified Successfully</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #333333; font-size: 24px; margin: 0;">Email Verified Successfully</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">Thank you for verifying your email address. Your account is now fully activated and ready to use.</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">If you have any questions or need further assistance, please feel free to contact our support team.</p>
            <a href="#" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007BFF; border-radius: 5px; text-decoration: none;">Get Started</a>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 14px; color: #999999;">
            <p>If you did not request this verification, please contact us immediately.</p>
            <p>&copy; ${new Date().getFullYear()} DEVELOPER.WK . All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
  });
};
export default emailVerifiedSuccessMail;
