import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";


export async function POST(request:Request){
    try {
        const body = await request.json();
        const {paramsToSign} = body;
    
        if(!paramsToSign || !process.env.CLOUDINARY_API_SECRET){
            return NextResponse.json({message:"missing paramsToSing"} , {status:400});
        }
    
        const signature = cloudinary.utils.api_sign_request(paramsToSign , process.env.CLOUDINARY_API_SECRET);
    
        return NextResponse.json({signature})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}