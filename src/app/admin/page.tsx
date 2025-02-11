import { cookies } from "next/headers"
import AddArticleForm from "./AddArticleForm"
import { verifyTokenForPage } from "@/utils/verifyToken";
import { redirect } from "next/navigation";

const AdminPage = async () => { 
  const token = (await cookies()).get("jwtToken")?.value || "";
  if(!token) redirect("/");
  const user = verifyTokenForPage(token);
  if(user?.isAdmin === false)return redirect("/");
  return (
    <div className="fix-height flex items-center justify-center px-5 lg:px-20">
      <div className="shadow p-4 bg-purple-200 rounded w-full">
        <h2 className="text-xl lg:text-2xl text-gray-700 font-semibold mb-4">
          Add New Article
        </h2>
        <AddArticleForm />
      </div>
    </div>
  )
}

export default AdminPage