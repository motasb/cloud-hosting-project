import { z } from "zod";

// Create Article Schema
export const createArticleSchema = z.object({
  title: z.string({ 
    required_error: "title is Requred" ,
    invalid_type_error:"title should be of type string"
  }).min(2).max(200),
  description: z.string().min(10),
});

// Create User Schema
export const registerSchema = z.object({
  username:z.string().min(2).max(100),//.optional()
  email:z.string().min(3).max(200).email(),
  password:z.string().min(6).max(200), 
});

// Login User Schema
export const loginSchema = z.object({
  email:z.string().min(3).max(200).email(),
  password:z.string().min(6).max(200), 
});

// Create Comment Schema
export const createCommentSchema = z.object({
  text:z.string().min(2).max(500),
  articleId: z.number(),
});

// Update User Profile Schema
export const updateUserSchema = z.object({
  username:z.string().min(2).max(100).optional(),
  email:z.string().min(3).max(200).email().optional(),
  password:z.string().min(6).max(200).optional(), 
});