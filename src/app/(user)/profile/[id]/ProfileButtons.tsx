"use client";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ProfileEditForm from "./ProfileEditForm";
import { User } from "@prisma/client";

interface ProfileButtonsProps{
  user: User;
}

const ProfileButtons = ({user}:ProfileButtonsProps) => {
  const [open , setOpen] = useState(false);
  const router = useRouter();
  const deleteProfileHandler = async () => {
    try {
      await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${DOMAIN}/api/users/profile/${user.id}`);
        await axios.get(`${DOMAIN}/api/users/logout`);
        router.refresh();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error: any) {
      toast.error(error?.response?.data.message);
    }
  };

  const logoutHandler = async ()=>{
    try {
      await Swal.fire({
      title: "Are you sure?",
      text: "You will be Logout Profile",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.get(`${DOMAIN}/api/users/logout`);
        router.refresh();
        Swal.fire({
          title: "Logout!",
          text: "Your file has been Logout.",
          icon: "success",
        });
      }
    });      
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error?.response?.data.message);
    }
  }

  return (
    <div className="mt-6 flex justify-between w-full">
      {open &&
      <ProfileEditForm user={user} setOpen={setOpen} />
      }
      <button onClick={()=>setOpen(prev => !prev)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Edit Profile
      </button>
      <button onClick={logoutHandler} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
        Log Out
      </button>
      <button onClick={deleteProfileHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Delete Profile
      </button>
    </div>
  );
};

export default ProfileButtons;
