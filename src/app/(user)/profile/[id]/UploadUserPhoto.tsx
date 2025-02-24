"use client";

import { DOMAIN } from "@/utils/constants";
import { UpdateUserDto } from "@/utils/dtos";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UploadUserPhotoState {
  public_id?: string;
  secure_url?: string;
}
interface UploadUserPhotoProps {
  id: number;
}

const UploadUserPhoto = ({ id }: UploadUserPhotoProps) => {
  const router = useRouter();

  const uploadPhotoHandler = async (resourse: UploadUserPhotoState) => {
    try {
      const updatePhoto: UpdateUserDto = {
        photoId: resourse?.public_id,
      };
      await axios.put(`${DOMAIN}/api/users/profile/${id}`, updatePhoto);
      toast.success(" Photo Updated");
      router.replace(`/profile/${id}`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };

  return (
    <CldUploadWidget
      signatureEndpoint={"/api/sign-cloudinary-params"}
      options={{
        sources: ["local", "url"],
        resourceType:"image",
        multiple: false,
        maxFileSize: 3000000,
        cropping: true,
      }}
      onSuccess={(result) => {
        if (typeof result.info === "object" && result.info !== null) {
          uploadPhotoHandler(result.info);
          console.log(result.info);
        }
      }}
      onError={(error) => {
        if (typeof error === "object" && error !== null && "status" in error) {
          toast.error(`${error.status}`);
        } else {
          toast.error("🚫 فشل رفع الصورة، حاول مرة أخرى.");
        }
      }}
      onQueuesEnd={(_, { widget }) => widget.close()}
    >
      {({ open }) => {
        return (
          <button
            onClick={() => {
              open();
            }}
            className="bg-blue-500 text-white p-1 rounded-md shadow-md hover:bg-blue-600 transition mt-1"
          >
            upload
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadUserPhoto;
