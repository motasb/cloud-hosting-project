import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/articles/search?searchText=value
 * @desc  Get Articles By search Text
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    const searchText = await request.nextUrl.searchParams.get("searchText");
    let articles;
    if (searchText) {
      articles = await prisma.article.findMany({
        where: {
          title: {
            startsWith: searchText,
            mode:"insensitive"
          }
        },
      });
    } else {
      articles = await prisma.article.findMany({ take: 6 });
    }
    return NextResponse.json(articles, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
