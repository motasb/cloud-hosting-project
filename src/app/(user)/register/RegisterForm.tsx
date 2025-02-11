"use client";
import {toast} from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import ButtonSpinner from "@/components/header/ButtonSpinner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
    const router =  useRouter();

    const [username , setUserName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [loading , setLoading] = useState(false);
    

    const formSubmitHandler = async (e:React.FormEvent)=>{
        e.preventDefault();
        if(username === "") return toast.error("Username is requred");
        if(email === "") return toast.error("Email is requred");
        if(password === "") return toast.error("Password is requred");

        try {
          setLoading(true)
          await axios.post(`${DOMAIN}/api/users/register` , {email , password ,username});
          router.replace("/login");
          setLoading(false)
          router.refresh();
          
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
          toast.error(error?.response?.data.message);
          console.log(error);
          setLoading(false);
        }
    }

  return (
    <form className="flex flex-col" onSubmit={formSubmitHandler}>
    <input
      className="mb-4 border rounded p-2 text-xl"
      type="text"
      placeholder="Enter Your Username"
      value={username}
      onChange={(e)=>setUserName(e.target.value)}
    />
    <input
      className="mb-4 border rounded p-2 text-xl"
      type="email"
      placeholder="Enter Your Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
    />
    <input
      className="mb-4 border rounded p-2 text-xl"
      type="password"
      placeholder="Enter Your Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
    />
    <button
      type="submit"
      className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
    >
      {loading ? <ButtonSpinner /> : "Register"}
    </button>
  </form>
  )
}

export default RegisterForm