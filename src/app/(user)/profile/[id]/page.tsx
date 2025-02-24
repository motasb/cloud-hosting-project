import ProfileButtons from "./ProfileButtons";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { User } from "@prisma/client";
import UploadUserPhoto from "./UploadUserPhoto";
import PhotoUser from "./PhotoUser";
import Image from "next/image";



interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const id = parseInt((await params).id);
  const token = (await cookies()).get("jwtToken")?.value || "";
  if (!token) redirect("/");
  const user = verifyTokenForPage(token);
  if (user?.id !== id) redirect("/");
  const userFromDb = (await prisma.user.findUnique({ where: { id } })) as User;

  return (
    <section className="fix-height max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        {/* صورة البروفايل */}
        {userFromDb.photoId ? (
          <PhotoUser photoId={userFromDb.photoId} />
        ) : (
          <Image
          src="/profile-icon.png"
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full border-4 border-gray-300"
          priority
        />
        )}
        <UploadUserPhoto id={userFromDb.id}/>
        {/* الاسم والنبذة */}
        <h2 className="mt-4 text-2xl font-semibold">{userFromDb.username}</h2>
        <p className="text-gray-600">
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(userFromDb.createdAt).toDateString()}
        </p>
        {/* معلومات الحساب */}
        <div className="mt-6 w-full space-y-4 text-gray-700">
          <div className="flex justify-center items-center gap-1">
            <span className="font-semibold">email:</span>
            <span>{userFromDb.email}</span>
          </div>
        </div>
        {/* أزرار الإجراءات */}
        <ProfileButtons user={userFromDb} />
      </div>
    </section>
  );
};

export default ProfilePage;
