import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const ContactController = async (req: Request, res: Response) => {
  const { name, email, message, subject } = req.body;
  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email harus diisi",
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maddlab.dev@gmail.com",
      pass: "luzk lqyc gdqk fjip",
    },
  });
  const mailOptions = {
    from: `"${name} via Website" <maddlab.dev@gmail.com>`,
    to: "maddlab.dev@gmail.com",
    subject: subject || "Pesan dari kontak",
    text: `Pesan baru dari kontak:
  
  Nama: ${name}
  Email: ${email}
  Subjek: ${subject}
  Pesan:
  ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">📩 Pesan Baru dari Website</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <p><strong>Pesan:</strong></p>
        <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
        <hr style="margin-top: 30px;"/>
        <small>Pesan ini dikirim dari form kontak website Anda.</small>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({
      success: true,
      message: "Email berhasil dikirim",
    });
    return;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim email",
    });
    return;
  }
};
