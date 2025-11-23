import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("email send...")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: 587,
      secure: false, // ⚠ important for 587
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    transporter.verify((err, success) => {
      if (err) console.log("SMTP ERROR:", err);
      else console.log("SMTP WORKING");
    });
    

    const mailOptions = {
      from: `"Bookworm Library" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return { success: false, error: error.message };
  }
};
