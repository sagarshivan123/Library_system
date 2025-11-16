
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT || 465,
      secure: false, // true if using port 465 (SSL)
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Bookworm Library" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    // ✅ Return a success object
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    // ✅ Return an error object
    return { success: false, error: error.message };
  }
};


