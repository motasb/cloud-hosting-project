"use client";
import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import ButtonSpinner from "@/components/header/ButtonSpinner";
import { useRouter } from "next/navigation";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { User } from "@prisma/client";
import { UpdateUserDto } from "@/utils/dtos";

interface ProfileEditFormProps {
  user: User;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileEditForm = ({ user, setOpen }: ProfileEditFormProps) => {
  const router = useRouter();

  const [username, setUserName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedUser: UpdateUserDto = {
        username,
        email,
      };
      if (password.trim() !== "") {
        updatedUser.password = password;
      }
      setLoading(true);
      await axios.put(`${DOMAIN}/api/users/profile/${user.id}`, 
        updatedUser,
      );
      toast.success(" User Updated");
      router.replace(`/profile/${user.id}`);
      router.refresh();
      setLoading(false);
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-10 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="w-11/12 lg:w-2/4 bg-white rounded-lg p-3">
        <div className="flex justify-end items-start mb-5">
          <IoMdCloseCircleOutline
            className="text-red-500 cursor-pointer text-3xl"
            onClick={() => setOpen(false)}
          />
        </div>
        <form className="flex flex-col" onSubmit={formSubmitHandler}>
          <input
            className="mb-4 border rounded p-2 text-xl"
            type="text"
            placeholder="Enter Your Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="mb-4 border rounded p-2 text-xl"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mb-4 border rounded p-2 text-xl"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
          >
            {loading ? <ButtonSpinner /> : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
