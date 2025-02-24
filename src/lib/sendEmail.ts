import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:process.env.APP_EMAIL_ADDRESS,
            pass:process.env.APP_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("internal Server Error (nodemailer)");
        // return { success: false, message: "Failed to send email." };
    }
}
