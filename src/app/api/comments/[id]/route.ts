import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateCommentDto } from "@/utils/dtos";

interface Props{
    params:Promise<{id:string}>
}

/**
 * @method PUT
 * @route ~/api/comments/:id
 * @desc  Update Comment
 * @access private (only oner of the comment)
 */
export async function PUT(request:NextRequest , {params}:Props) {
    const {id} = await params
try {
    const comment = await prisma.comment.findUnique({where:{id:parseInt(id)}});
    if(!comment){
        return NextResponse.json({message:"comment not found"} , {status:404});
    }
    const user = verifyToken(request);
    if(user === null || user.id !== comment.userId){
        return NextResponse.json({message:"only user , accsess denied"} , {status:403});
    }

    const body = await request.json() as UpdateCommentDto;

    const updatedComment = await prisma.comment.update({
    where:{id: parseInt(id)},
    data:{text:body.text}
})
return NextResponse.json(updatedComment , {status:200});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return NextResponse.json(
        { message: "internal server error" },
        { status: 500 }
    );
}
}

/**
 * @method DELETE
 * @route ~/api/comments/:id
 * @desc  DELETE Comment
 * @access private ( oner of the comment and Admin )
 */

export async function DELETE(request:NextRequest , {params}:Props) {
    const {id} = await params
try {
    const comment = await prisma.comment.findUnique({where:{id:parseInt(id)}});
    if(!comment){
        return NextResponse.json({message:"comment not found"} ,{status:404});
    }
    const user = verifyToken(request);

    if(!user    ){
        return NextResponse.json({message:"no token provided, acsses denied"} ,{status:401});
    }
    if(user.isAdmin || user.id === comment.userId ){
        await prisma.comment.delete({where:{id:parseInt(id)}});
        return NextResponse.json({message:"comment deleted"} , {status:200})
    }

    return NextResponse.json({message:" not allowed you access denied"} , {status:403})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return NextResponse.json(
        { message: "internal server error" },
        { status: 500 }
    );
}
}