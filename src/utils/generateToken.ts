import Jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import {serialize} from "cookie";


// // Genrate  JWT Token
// export function generateJWT(jwtPayload : JWTPayload):string{
//     const token = Jwt.sign(jwtPayload,process.env.JWT_SECRET as string);
//     return token;
// }

// //  Set Cookie with JWT
// export function setCookie(jwtPayload:JWTPayload):string{
//     const token = generateJWT(jwtPayload);

//     const cookie = serialize("jwtToken" , token ,{
//         httpOnly:true,  //protection
//         secure: process.env.NODE_ENV === 'production', // https : false  // protection too
//         sameSite: "strict",  // increment protection too
//         path: '/', // all pages
//         maxAge: 60 * 60 * 24 * 30, //30 days (time)
//     });

//     return cookie;
// }

// Generate JWT Token
export function generateJWT(jwtPayload: JWTPayload): string {
    return Jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
        expiresIn: "30d", // إضافة مدة انتهاء التوكن
    });
}

// Set Cookie with JWT (only for verified users)
export function setCookie(jwtPayload: JWTPayload, isVerified: boolean): string | null {
    if (!isVerified) return null; // رفض إنشاء الكوكي لمستخدم غير موثق

    const token = generateJWT(jwtPayload);

    return serialize("jwtToken", token, {
        httpOnly: true,  // Protection against XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
}