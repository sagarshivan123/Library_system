export function generateVerificationOtpEmailTemplate(otpCode){
  return `<body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
    </div>
    <div class="text-gray-600 text-base space-y-4">
      <p>Hello,</p>
      <p>We received a request to verify your email address. Please use the OTP code below to complete your verification:</p>
      <div class="bg-gray-200 text-gray-900 text-2xl font-bold tracking-widest py-3 px-6 rounded-md text-center w-32 mx-auto">
        ${otpCode}
      </div>
      <p class="text-sm text-gray-500">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      <p class="text-sm text-gray-400">If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="mt-6 text-center text-gray-400 text-sm">
      &copy; 2025 Your Company Name. All rights reserved.
    </div>
  </div>
</body>`;
}


export function generatePasswordResetEmailTemplate(resetPasswordUrl) {
  return `
  <body style="background-color:#f9fafb; font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial;">
    <div style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:32px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      <h2 style="font-size:24px; font-weight:700; color:#111827; margin-bottom:16px;">Reset your password</h2>

      <p style="font-size:16px; color:#374151; line-height:1.6; margin-top:8px;">
        We received a request to reset your password. Click the button below to create a new one:
      </p>

      <div style="text-align:center; margin-top:24px; margin-bottom:24px;">
        <a href="${resetPasswordUrl}" 
           style="background-color:#3b82f6; color:white; font-weight:600; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-block;">
           Reset Password
        </a>
      </div>

      <p style="font-size:15px; color:#6b7280; line-height:1.6;">
        If you didn’t request this, you can safely ignore this email. This link will expire in 
        <span style="font-weight:600; color:#111827;">15 minutes</span>.
      </p>

      <p style="font-size:15px; color:#374151; line-height:1.6; margin-top:16px;">
        If the button above doesn’t work, copy and paste the following link into your browser:
      </p>

      <p style="word-break:break-all; color:#3b82f6; font-size:14px; margin-top:8px;">
        <a href="${resetPasswordUrl}" style="color:#3b82f6; text-decoration:none;">${resetPasswordUrl}</a>
      </p>

      <hr style="margin-top:32px; margin-bottom:16px; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:14px; color:#9ca3af; text-align:center;">
        Thanks,<br />
        <span style="color:#111827; font-weight:600;">The Support Team</span>
      </p>
    </div>
  </body>
  `;
}
