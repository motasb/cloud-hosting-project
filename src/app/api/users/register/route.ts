import prisma from "@/utils/db";
import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { DOMAIN } from "@/utils/constants";
import { sendEmail } from "@/lib/sendEmail";

/**
 * @method POST
 * @route ~/api/users/register
 * @desc  Create New User
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({where:{email: body.email}});
    if(user){
        return NextResponse.json({message:"This Email already registered"} , { status: 400});
    }

    const salt = await bcrypt.genSalt(10);
    body.password =  await bcrypt.hash(body.password , salt);


    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
      select: {
        id: true,
        username: true,
        isAdmin: true,
        isVerified: true,
        email:true,
      }
    });
    // create verificationToken 

    const verificationToken = await prisma.verificationToken.create({
      data: {
        userId: newUser.id,
        token: crypto.randomBytes(32).toString("hex"),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // انتهاء بعد 24 ساعة
      },
    });
    // sendToken
    const link = `${DOMAIN}/api/users/verify/${newUser.id}/${verificationToken.token}`;
    const htmlTemplate = `
    <div>
        <p> Click on the link below to verify your email</p>
        <a href="${link}"> Verify</a>
    </div>`;
    await sendEmail(newUser.email , "Verify Your Email" , htmlTemplate);



      return NextResponse.json(
        { message: "Registration successful! Please verify your email." },
        { status: 201 }
      );
    
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
