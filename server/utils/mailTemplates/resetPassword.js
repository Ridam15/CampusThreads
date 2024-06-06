const resetPassword = (url, firstname) => {
    return `<!DOCTYPE html>
    <html>
    <head>
    <style>
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: left;
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
        padding: 20px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        color: #7f8c8d;
      }
      
      @media screen and (max-width: 480px) {
        .container {
          padding: 10px;
        }
        .button {
          display: block;
          margin-top: 20px;
        }
      }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Forgot Your Password?</h2>
        </div>
        <div class="content">
          <p>Dear ${firstname},</p>
          <p>We received a request to reset your password for your Campus Threads account. Please click the button below to reset your password:</p>
          <a href="${url}" class="button">Reset Password</a>
          <p>If you didn't request to reset your password, please ignore this message or contact our support team.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Campus Threads Team</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };
  
  module.exports = resetPassword;