const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
      }
      .header {
        background-color: #3498db;
        color: white;
        padding: 20px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .content {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #2980b9;
        color: white;
        padding: 15px 25px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 30px;
      }
      .button:hover {
        background-color: #1f618d;
      }
      .footer {
        background-color: #ecf0f1;
        padding: 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      @media screen and (max-width: 600px) {
        .container {
          width: 100%;
        }
      }
    </style>
    </head>
      
      <body>
          <div class="container">
              <div class="header">
                  <h2>Welcome to Campus Threads!</h2>
              </div>
              <div class="message">OTP Verification Email</div>
              <div class="content">
              <p>Dear User,</p>
              <p>Thank you for joining Campus Threads! We're excited to have you as part of our community.To complete your registration, please use the following OTP
              (One-Time Password) to verify your account:</p>
              <h2 class="highlight">${otp}</h2>
              <p>By confirming your email, you'll be able to unlock all the features and resources that Campus Threads has to offer.</p>
              <p>If you didn't sign up for Campus Threads, please disregard this email.</p>
              </div>
              <div class="footer">
              <p>Best regards,<br>The Campus Threads Team</p>
              </div>
    </div>
  </body>
  </html>`;
  };
  module.exports = otpTemplate;