const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "jonahjohn411@gmail.com",
      pass: "belv jfba rgqn wcmh",
    },
  });
};

module.exports = createTransporter;
