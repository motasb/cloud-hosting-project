import Link from "next/link";
import LoginForm from "./LoginForm";

const LoginPage = async () => {

  return (
    <section className="fix-height container m-auto px-7 flex items-center justify-center">
      <div className="m-auto bg-white rounded-lg p-5 w-full md:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Log In</h1>
        <LoginForm />
        <Link className="p-1 bg-blue-500 hover:bg-blue-700 mt-3 block w-fit rounded-lg text-sm text-white hover:text-blue-100" href={"/verify"}>Resend verify Link</Link>
      </div>
    </section>
  );
};

export default LoginPage;
