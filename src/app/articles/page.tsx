import { getArticles , getArticleCount } from "@/apiCalls/articleApiCall";
import ArticleItem from "@/components/articles/ArticleItem";
import Pagination from "@/components/articles/Pagination";
import SearchArticleInput from "@/components/articles/SearchArticleInput";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Article } from "@prisma/client";
import type { Metadata } from "next";

interface ArticlesPageProps {
  searchParams:Promise<{pageNumber:string}>; 
}



const ArticlesPage = async ({searchParams}:ArticlesPageProps) => {
  // delay 10s
  // await new Promise((resolve) => setTimeout(resolve,3000));

  const {pageNumber} = await searchParams;

  const articles:Article[] = await getArticles(pageNumber);
  const count:number = await getArticleCount();

  const pages = Math.ceil(count / ARTICLE_PER_PAGE);

  return (
    <section className="container m-auto px-5">
      <SearchArticleInput/>
      <div className="flex items-center justify-center flex-wrap gap-7">
        {articles.map((item) => (
          <ArticleItem article={item} key={item.id} />
        ))}
      </div>
      <Pagination pages={pages} pageNumber={parseInt(pageNumber)} route="/articles"/>
    </section>
  );
};

export default ArticlesPage;

export const metadata: Metadata = {
  title: "Articles Page",
  description: "Articles About Programming",
};
