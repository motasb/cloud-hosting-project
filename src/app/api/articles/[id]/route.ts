import { UpdateArticleDto } from "@/utils/dtos";
import { NextRequest , NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";


interface Props{
    params:Promise<{id:string;}>
}

/**
 * @method GET
 * @route ~/api/articles/:id
 * @desc  Get Single Article by Id
 * @access public
 */
export async function GET( request:NextRequest , {params}:Props ){
    const {id} = await params
    try {
        const article = await prisma.article.findUnique({where:{id: parseInt(id)} ,
        include:{
            comments:{
                include:{
                    user: {
                        select:{
                            username:true
                        }
                    }
                },
                orderBy: {
                    createdAt:"desc"
                }
            },
        }});
        if(!article){
            return NextResponse.json({message:"article not found"} , {status:404});
        }
        return NextResponse.json(article , {status: 200});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({message: "internal server error"}, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/articles/:id
 * @desc  Update Article
 * @access private (only admin)
 */
export async function PUT( request: NextRequest , {params}:Props ){
    const {id} = await params
    try {
        const user = verifyToken(request);
        if(!user || user.isAdmin === false){
            return NextResponse.json({message:"only admin access denied"} , {status:403});
        }
        const article = await prisma.article.findUnique({where:{id:parseInt(id)}})
        if(!article){
            return NextResponse.json({message:"article not found"} , {status:404})
        }
        const body =  (await request.json()) as UpdateArticleDto;
        const updatedArticle =  await prisma.article.update({
            where: {id: parseInt(id)},
            data:{
                title:body.title,
                description:body.description,
            }
        })
        
        return NextResponse.json(updatedArticle , {status: 200});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({message: "internal server error"}, { status: 500 });

    }
}

/**
 * @method DELETE
 * @route ~/api/articles/:id
 * @desc  Delete Article
 * @access private (only admin)
 */
export async function DELETE( request: NextRequest , {params}:Props ){
    const {id} = await params
try {
    const user = verifyToken(request);
    if(!user || user.isAdmin === false){
        return NextResponse.json({message:"only admin access denied"} , {status:403});
    }
    const article = await prisma.article.findUnique({
        where:{id: parseInt(id)},
        include:{
            comments:true,
        }
    });
    if(!article){
        return NextResponse.json({message:"article not found"} , {status:404})
    }
    // deleteing the article
    await prisma.article.delete({
        where:{id:parseInt(id)}
    });

    return NextResponse.json({message: 'article deleted' } , {status: 200});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    return NextResponse.json({message: "internal server error"}, { status: 500 });
}
}