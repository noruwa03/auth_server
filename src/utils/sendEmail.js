const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs");
const util = require("util");
const path = require("path");

const baseDirectory = path.resolve(__dirname, "..");
const relativeTemplatePath = "/template/welcome.html";
const templatePath = path.join(baseDirectory, relativeTemplatePath);


// Read the HTML template file
const readFile = util.promisify(fs.readFile);
const readHTMLFile = async (path) => {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    console.error("Error reading HTML template:", error);
    throw error;
  }
};

const { EMAIL, PASSKEY } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSKEY,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log(success);
  }
});

const sendEmail = async (email, otp, hr) => {
  const date = new Date().getFullYear();
  // Read the HTML template file
  const htmlTemplate = await readHTMLFile(templatePath);
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Verify your email",
    html: htmlTemplate
      .replace("{{otp}}", otp)
      .replace("{{hr}}", hr)
      .replace("{{date}}", date),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
