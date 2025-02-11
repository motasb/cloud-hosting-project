"use client";
import { CommentWithUser } from "@/utils/types";
import UpdateCommentModal from "@/components/comments/UpdateCommentModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import Swal from "sweetalert2";

interface CommentItemProps {
  comment: CommentWithUser;
  userId: number | undefined;
}
const CommentItem = ({ comment, userId }: CommentItemProps) => {
  const [open, setOpen] = useState(false);
    const router = useRouter();
  const commentDeleteHandler = async()=>{
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be delete this Comment!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${DOMAIN}/api/comments/${comment.id}`);
                router.refresh();
              Swal.fire({
                title: "Deleted!",
                text: "Your Comment has been deleted.",
                icon: "success"
              });
            }
          });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        toast.error(error?.response?.data.message)
        console.log(error);
    }
  }

  return (
    <div className="mb-5 rounded-lg p-3 bg-gray-200 border-2 border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-gray-800 uppercase">
          {comment.user.username}
        </strong>
        <span className="bg-yellow-700 px-1 rounded-lg text-white">
          {new Date(comment.createdAt).toDateString()}
        </span>
      </div>
      <p className="text-gray-800 mb-2">{comment.text}</p>
      {userId && userId === comment.userId && (
        <div className="flex justify-end items-center">
          <FaEdit
            onClick={() => setOpen(true)}
            className="text-green-600 text-xl cursor-pointer me-3"
          />
          <FaTrash onClick={commentDeleteHandler} className="text-red-600 text-xl cursor-pointer" />
        </div>
      )}
      {open && (
        <UpdateCommentModal
          setOpen={setOpen}
          text={comment.text}
          commentId={comment.id}
        />
      )}
    </div>
  );
};

export default CommentItem;
