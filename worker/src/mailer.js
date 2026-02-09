import nodemailer from "nodemailer";

function getEmailAuth() {
  const user = process.env.ALERT_EMAIL?.trim();
  const rawPass = process.env.ALERT_EMAIL_PASSWORD || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("Missing email credentials");
  }

  return { user, pass };
}

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: getEmailAuth()
  });
}


export async function sendDownAlert(website) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"MyCronJob Alerts" <${process.env.ALERT_EMAIL}>`,
    to: website.alertEmail, // see note below
    subject: "🚨 Website Down Alert",
    text: `
Your website is DOWN.

URL: ${website.url}
Time: ${new Date().toLocaleString()}

Please check immediately.
`
  });
}

export async function sendRecoveryAlert(website) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"MyCronJob Alerts" <${process.env.ALERT_EMAIL}>`,
      to: website.alertEmail,
      subject: "✅ Website Recovered",
      text: `
    Good news! Your website is back UP.

    URL: ${website.url}
    Time: ${new Date().toLocaleString()}
    `
    });
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}
