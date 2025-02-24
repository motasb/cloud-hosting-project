import { Article ,Comment , User } from "@prisma/client";


export type JWTPayload = {
      id: number;
      isAdmin: boolean;
      username:string; 
      photoId?:string;
  }

export type CommentWithUser = Comment & {user: User};

export type SingleArticle = Article & {comments: CommentWithUser[]}