"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";

interface DeleteCommentBtnProps {
  commentId: number;
}

const DeleteCommentBtn = ({ commentId }: DeleteCommentBtnProps) => {
  const router = useRouter();

  const deleteCommentHandler = async () => {
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
          await axios.delete(`${DOMAIN}/api/comments/${commentId}`);
          router.refresh();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div
      onClick={deleteCommentHandler}
      className=" bg-red-600 text-white rounded-lg inline-block py-1 px-2 cursor-pointer hover:bg-red-800 transition"
    >
      Delete
    </div>
  );
};

export default DeleteCommentBtn;
