import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";

export async function sendVerificationCode(verificationCode, email) {
  try {
    // 1️⃣ Generate the HTML email content
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    // 2️⃣ Send the email
    const result = await sendEmail({
      email,
      subject: "Verification Code (Bookworm Library Management System)",
      message,
    });

    // 3️⃣ Check if the sendEmail function succeeded
    if (!result.success) {
      throw new Error(result.error || "Failed to send verification email");
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    };

  } catch (err) {
    console.error("❌ Error in sendVerificationCode:", err.message);
    return {
      success: false,
      message: "Verification code failed to send",
      error: err.message,
    };
  }
}

