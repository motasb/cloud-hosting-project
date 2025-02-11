import { DOMAIN } from "@/utils/constants";
import { SingleArticle } from "@/utils/types";
import { Article } from "@prisma/client";

//  get articles based on pageNumber
export async function getArticles(pageNumber:string | undefined):Promise<Article[]>{
  const response = await fetch(`${DOMAIN}/api/articles?pageNumber=${pageNumber}` , {
    cache:"no-store"
  })
  if(!response.ok){
    throw new Error("Failed to fetch articles");
  }
  return response.json();
  
}
//  get articles Count 
export async function getArticleCount(): Promise<number> {
    const response  = await fetch(`${DOMAIN}/api/articles/count` , {
      cache:"no-store"
    });
    if(!response.ok){
        throw new Error("Failed to get articles count");
      }
    const {count} = await response.json() as {count:number};
    return count;
}
//  get articles based on SearchText
export async function getArticlesBasedOnSearch(SearchText:string | undefined):Promise<Article[]>{
    const response = await fetch(`${DOMAIN}/api/articles/search?searchText=${SearchText}`)
    if(!response.ok){
      throw new Error("Failed to fetch articles searchText");
    }
    return response.json();
    
  }

  // get single article by id
export async function getSingleArticle(articleId:string) : Promise<SingleArticle>{

    const response = await fetch(`${DOMAIN}/api/articles/${articleId}`);
    if(!response.ok){
        throw new Error("Failed to fetch article");
      }
    return response.json();
} 