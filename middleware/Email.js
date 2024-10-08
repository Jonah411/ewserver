const {
  Verification_Email_Template,
  Welcome_Email_Template,
} = require("../config/EmailTemplate");
const createTransporter = require("./email.confiq");

const SendVerificationCode = async (email, verificationCode) => {
  const transporter = createTransporter();
  try {
    const response = await transporter.sendMail({
      from: '"Jonah" <jonahjohn411@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      text: "Verify Your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    return response;
  } catch (error) {
    console.log("Email error", error);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  try {
    const response = await transporter.sendMail({
      from: '"Jonah" <jonahjohn411@gmail.com>',
      to: email,
      subject: "Welcome Email",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name),
    });
    return response;
  } catch (error) {
    console.log("Email error", error);
  }
};

module.exports = { SendVerificationCode, sendWelcomeEmail };
