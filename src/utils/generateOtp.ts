const generateOtp = (length: number) => {
  let otp = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
};
export default generateOtp;
