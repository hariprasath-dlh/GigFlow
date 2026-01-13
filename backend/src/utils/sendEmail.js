import nodemailer from "nodemailer";

export const sendHireEmail = async ({ to, freelancerName, gigTitle, budget }) => {
  // 1. Verify Credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email credentials missing in .env (EMAIL_USER or EMAIL_PASS)");
    return;
  }

  console.log(`📧 Preparing to send email from: ${process.env.EMAIL_USER}`);

  try {
    // 2. Configure Transporter (Explicit Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Verify Transporter Connection
    await transporter.verify();
    console.log("✅ Transporter ready");

    // 4. Define Email Options
    const mailOptions = {
      from: `"GigFlow Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: `You’ve been hired for "${gigTitle}" on GigFlow 🎉`,
      text: `Hi ${freelancerName},

Congratulations! 🎉
Your bid for the project "${gigTitle}" has been accepted.

Project Budget: ₹${budget}

Please log in to GigFlow to view the project details.

— GigFlow Team`,
    };

    // 5. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
    console.log("📝 Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ Email sending failed!");
    console.error("👉 Error:", error.message);
    if (error.response) {
      console.error("👉 Response:", error.response);
    }
  }
};
