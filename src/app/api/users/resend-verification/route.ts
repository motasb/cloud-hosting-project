import prisma from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { DOMAIN } from "@/utils/constants";
import { sendEmail } from "@/lib/sendEmail";
import { isUserBlocked } from "@/utils/rateLimiter";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "This email is already verified" },
        { status: 400 }
      );
    }

      // ✅ منع الإرسال المتكرر خلال دقيقة واحدة
      if (isUserBlocked(user.id.toString())) {
        return NextResponse.json(
          { message: " لقد طلبت التحقق بالفعل. يرجى المحاولة بعد دقيقة." },
          { status: 429 }
        );
      }

    // حذف أي توكن قديم إن وجد
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // إنشاء توكن جديد
    const newVerificationToken = await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: crypto.randomBytes(32).toString("hex"),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // صالح لمدة 24 ساعة
      },
    });

    // إرسال التوكين الجديد عبر البريد الإلكتروني
    const link = `${DOMAIN}/api/users/verify/${user.id}/${newVerificationToken.token}`;
    const htmlTemplate = `
    <div>
        <p>Click on the link below to verify your email:</p>
        <a href="${link}">Verify Email</a>
    </div>`;
    
    await sendEmail(user.email, "Verify Your Email", htmlTemplate);

    return NextResponse.json(
      { message: "Verification email sent successfully!" },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
