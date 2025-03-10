import prisma from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchemas";
import { NextRequest ,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

/**
 * @method POST
 * @route ~/api/users/login
 * @desc  Login User
 * @access public
 */
export async function POST(request:NextRequest){
try {
    const body = await request.json() as LoginUserDto;
    const validation = loginSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json({message: validation.error.errors[0].message} ,{ status:400});
    }

    const user = await prisma.user.findUnique({where:{email:body.email}});
    if(!user){
        return NextResponse.json({message:"invalid email or password"} , {status:404});
    }

    const isPasswordMatch = await bcrypt.compare(body.password , user.password);
    if(!isPasswordMatch){
        return NextResponse.json({message: "invalid email or password"} , {status:400});
    }

    if (!user.isVerified) {
        return NextResponse.json(
            { message: "Please verify your email before logging in." }, 
            { status: 400 }
        );
    }
    

    const cookie = setCookie(
        {
          id: user.id,
          isAdmin: user.isAdmin,    
          username: user.username,
        },
        user.isVerified
      );
  
      const headers: HeadersInit = cookie ? { "Set-Cookie": cookie } : {};
  
      return NextResponse.json({ message: "Authenticated" }, { status: 200, headers });
  
        
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return NextResponse.json(
        { message: "internal server error" },
        { status: 500 }
      );
}
}