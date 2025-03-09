const verifyEmailTemplate = (otp, companyName) => {
    return `
      <html>
        <body>
          <p><strong>${companyName}</strong></p>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>Thank you for registering with us.</p>
        </body>
      </html>
    `;
  };  
  
module.exports = verifyEmailTemplate ;