import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { CreateCommentDto } from "@/utils/dtos";
import { createCommentSchema } from "@/utils/validationSchemas";

/**
 * @method POST
 * @route ~/api/comments
 * @desc  Create New Comment
 * @access private (only login user)
 */
export async function POST(request:NextRequest){
try {
        const user = verifyToken(request);
        if(!user){
            return NextResponse.json({message:"only login user , accsess denied"} , {status: 401})
        }
        
        

        const body = await request.json() as CreateCommentDto;

        const validate = createCommentSchema.safeParse(body);
        if(!validate.success){
            return NextResponse.json({message: validate.error.errors[0].message} , {status:400});
        }
        const newComment = await prisma.comment.create({
            data:{
                text:body.text,
                articleId:body.articleId,
                userId: user.id,
            }
        })

        return NextResponse.json(newComment , {status:201}); 

    
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return NextResponse.json(
        { message: "internal server error" },
        { status: 500 }
      );
}
}

/**
 * @method GET
 * @route ~/api/comments
 * @desc  Get All Comment
 * @access private (only Admin)
 */
export async function GET(request:NextRequest){
    try {
        const user = verifyToken(request);
        if(!user || user.isAdmin === false){
            return NextResponse.json({message:"only Admin , access denied"} ,{status:403});
        }

        const comments = await prisma.comment.findMany();

        return NextResponse.json(comments ,{ status:200});
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json(
            { message: "internal server error" },
            { status: 500 }
        );
    }
}
