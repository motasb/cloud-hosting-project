import Jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import {serialize} from "cookie";


// Genrate  JWT Token
export function generateJWT(jwtPayload : JWTPayload):string{
    const token = Jwt.sign(jwtPayload,process.env.JWT_SECRET as string);
    return token;
}

//  Set Cookie with JWT
export function setCookie(jwtPayload:JWTPayload):string{
    const token = generateJWT(jwtPayload);

    const cookie = serialize("jwtToken" , token ,{
        httpOnly:true,  //protection
        secure: process.env.NODE_ENV === 'production', // https : false  // protection too
        sameSite: "strict",  // increment protection too
        path: '/', // all pages
        maxAge: 60 * 60 * 24 * 30, //30 days (time)
    });

    return cookie;
}