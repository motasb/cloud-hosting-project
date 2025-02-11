"use client";
import {toast} from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { Article } from "@prisma/client";

interface EditArticleFormProps{
    article:Article;
}

const EditArticleForm = ({article}:EditArticleFormProps) => {
    const router = useRouter();
    const [title , setTitle] = useState(article.title);
    const [description , setDescription] = useState(article.description);

    const formSubmitHandler = async (e:React.FormEvent)=>{
        e.preventDefault();
        if(title === "") return toast.error("Title is requred");
        if(description === "") return toast.error("Description is requred");
        try {
          await axios.put(`${DOMAIN}/api/articles/${article.id}` , {title , description});
          toast.success(" Article Updated");
          router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
          toast.error(error?.response?.data.message);
          console.log(error);
        }
    }

  return (
    <form className="flex flex-col" onSubmit={formSubmitHandler}>
    <input
      className="mb-4 border rounded p-2 text-xl"
      type="text"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
    />
    <textarea className="mb-4 p-2 lg:text-xl rounded resize-none" 
    rows={5}
    value={description}
    onChange={(e)=>setDescription(e.target.value)}
    ></textarea>
    <button
      type="submit"
      className="text-2xl text-white bg-green-700 hover:bg-green-900 p-2 rounded-lg font-bold"
    >
      Edit
    </button>
  </form>
  )
}

export default EditArticleForm