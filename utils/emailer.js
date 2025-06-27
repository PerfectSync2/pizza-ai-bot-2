const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendDebugEmail(transcript, aiReply) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: "🍕 Pizza Bot - New Order or Question",
    html: `
      <h3>🗣️ Customer Said:</h3>
      <p>${transcript}</p>
      <h3>🤖 AI Responded:</h3>
      <p>${aiReply}</p>
      <hr>
      <small>This is an automated log from your pizza voice AI.</small>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendDebugEmail };