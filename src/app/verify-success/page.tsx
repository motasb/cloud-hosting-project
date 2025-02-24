
export default function VerifySuccess() {

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ تم التحقق من بريدك الإلكتروني بنجاح!
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        يمكنك الآن تسجيل الدخول إلى حسابك.
      </p>
      <a
        href="/login"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        تسجيل الدخول
      </a>
    </div>
  );
}
