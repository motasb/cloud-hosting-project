import { getAllComments } from '@/apiCalls/adminApiCall';
import { verifyTokenForPage } from '@/utils/verifyToken';
import { Comment } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DeleteCommentBtn from './DeleteCommentBtn';
import Link from 'next/link';

const AdminCommentsTable = async () => {
    const token = (await cookies()).get("jwtToken")?.value || "";
    if(!token) redirect("/");
    const user = verifyTokenForPage(token);
    if(user?.isAdmin === false)return redirect("/");

    const comments:Comment[] = await getAllComments(token);

  return (
    <section className='p-5'>
      <h1 className='mb-7 text-2xl font-semibold text-gray-700'>Comments</h1>
      <table className='table w-full text-left'>
        <thead className='border-t-2 border-b-2 border-gray-500 text-xl'>
          <tr>
            <th className='p-2'>Comment</th>
            <th className='hidden lg:inline-block p-3'>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment =>(
            <tr key={comment.id} className='border-b border-t border-gray-300'>
              <td className='p-3 text-gray-700'>
                {comment.text}
              </td>
              <td className='text-gray-700 p-3 font-normal hidden lg:inline-block'>
                {new Date(comment.createdAt).toDateString()}
              </td>
              <td>
              <Link
                  href={`/articles/${comment.articleId}`}
                  className="bg-green-600 text-white rounded-lg py-1 px-2 inline-block text-center mb-2 me-2 lg:me-3 hover:bg-green-800 transition"
                > 
                  Article
                </Link>
                <DeleteCommentBtn commentId={comment.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AdminCommentsTable