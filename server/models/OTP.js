const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailSchema = require("../utils/mailTemplates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

  async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email from Campus Threads",
        emailSchema(otp)
      );
      console.log("Mail Sent Successfully", mailResponse);
    } catch (error) {
      console.log("error occured while sending verification email", error);
      throw error;
    }
  }
  
  OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
  });
  
  module.exports = mongoose.model("OTP", OTPSchema);