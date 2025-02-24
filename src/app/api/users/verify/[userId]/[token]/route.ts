import prisma from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import { DOMAIN } from "@/utils/constants";

/**
 * @method GET
 * @route ~/api/users/verify/[userId]/[token]
 * @desc Verify User Email
 * @access public
 */
interface Params {
  params: Promise<{
    userId: string;
    token: string;
  }>;
}
export async function GET(request: NextRequest,{ params }:Params) {
  try {
    const { userId, token } = await params;

    if (!userId || !token) {
      return NextResponse.json(
        { message: "Invalid request. Missing parameters." },
        { status: 400 }
      );
    }

    // 1️⃣ البحث عن التوكن في قاعدة البيانات
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { userId:parseInt(userId) },
    });

    if (!verificationToken || verificationToken.userId !== Number(userId)) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    // 2️⃣ التحقق مما إذا كان التوكن منتهي الصلاحية
    if (new Date() > verificationToken.expiresAt) {
      await prisma.verificationToken.delete({ where: { userId:parseInt(userId) } }); // حذف التوكن المنتهي
      return NextResponse.json(
        { message: "Token has expired. Please request a new verification email." },
        { status: 400 }
      );
    } 

    // 4️⃣ تحديث حالة المستخدم إلى "مُحقق"
    await prisma.user.update({
      where: { id: Number(userId) }, // تحويل `userId` إلى رقم إذا كان في قاعدة البيانات `Int`
      data: { isVerified: true },
    });

    // 5️⃣ حذف التوكن من قاعدة البيانات بعد الاستخدام
    await prisma.verificationToken.delete({ where: { userId:parseInt(userId) } });

    return NextResponse.redirect(`${DOMAIN}/verify-success`);

  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
    