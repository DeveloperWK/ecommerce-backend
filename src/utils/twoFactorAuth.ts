import { transporter } from './verifyOtpSend.service';

const twoFactorAuthOtp = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env._SMTP_USERNAME,
    to: email,
    subject: 'Two Factor Authentication',
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Two-Factor Authentication (2FA) OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 30px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="500px" cellspacing="0" cellpadding="0" border="0" style="background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <img src="https://yourlogo.com/logo.png" alt="Your Logo" width="100" style="display: block;">
                        </td>
                    </tr>

                    <!-- Lock Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="display: inline-block; background: #e8f1ff; border-radius: 50%; width: 70px; height: 70px; line-height: 70px; font-size: 40px; color: #007bff;">🔒</div>
                        </td>
                    </tr>

                    <!-- Heading -->
                    <tr>
                        <td>
                            <h2 style="color: #333; font-size: 22px; margin-bottom: 10px;">Two-Factor Authentication (2FA)</h2>
                            <p style="font-size: 15px; color: #666; margin-bottom: 20px;">Use the following <strong>One-Time Password (OTP)</strong> to complete your login:</p>
                        </td>
                    </tr>

                    <!-- OTP Code -->
                    <tr>
                        <td>
                            <div style="display: inline-block; padding: 12px 24px; font-size: 22px; font-weight: bold; color: #007bff; background: #f1f8ff; border-radius: 8px; letter-spacing: 3px;">
                                ${otp}
                            </div>
                        </td>
                    </tr>

                    <!-- OTP Expiration -->
                    <tr>
                        <td>
                            <p style="font-size: 14px; color: #777; margin: 15px 0;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                        </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <a href="https://yourwebsite.com/login" style="background: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                                Login Now
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 25px; font-size: 13px; color: #888;">
                            <p>Didn't request this code? <a href="mailto:support@yourwebsite.com" style="color: #007bff; text-decoration: none; font-weight: bold;">Contact Support</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

`,
  });
};
export default twoFactorAuthOtp;
