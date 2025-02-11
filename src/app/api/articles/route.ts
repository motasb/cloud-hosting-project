import { NextRequest, NextResponse } from "next/server";
import { createArticleSchema } from "@/utils/validationSchemas";
import { CreateArticleDto } from "@/utils/dtos";
import { Article } from "@prisma/client";
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";

/**
 * @method GET
 * @route ~/api/articles
 * @desc  Get Articles By PageNumber
 * @access public 
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumper = request.nextUrl.searchParams.get("pageNumber") || "1";
    
    const articles = await prisma.article.findMany({
      skip: ARTICLE_PER_PAGE * (parseInt(pageNumper) - 1),
      take: ARTICLE_PER_PAGE,
      orderBy:{createdAt:"desc"} // رتبنها بناء على الكريتيد ات بالعكس 
    });

    return NextResponse.json(articles, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({message: "internal server error"}, { status: 500 });
  }
}

/**
 * @method POST
 * @route ~/api/articles
 * @desc  Create New Article
 * @access private
 */
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);

    if(!user || user.isAdmin === false){
      return NextResponse.json({message:"only admin , accsess denied"} , {status:403});
    }

    const body = (await request.json()) as CreateArticleDto;

    const validation = createArticleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(newArticle, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({message: "internal server error"}, {status:500})
  }
}
