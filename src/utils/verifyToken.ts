import Jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { JWTPayload } from "@/utils/types";

//  verifyToken for api end point
export function verifyToken(request:NextRequest):JWTPayload | null {
try {
    const jwtToken = request.cookies.get("jwtToken");
    const token = jwtToken?.value as string;
    if(!token)return null;
    
    const userFromToken = Jwt.verify(token , process.env.JWT_SECRET as string) as JWTPayload;
    return userFromToken;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return null;
}
}

//  verifyToken for page
export function verifyTokenForPage(token:string):JWTPayload | null {
    try {
        const userFromToken = Jwt.verify(token , process.env.JWT_SECRET as string) as JWTPayload;
        if(!userFromToken){
            return null
        }
        return userFromToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
    }