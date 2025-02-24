"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setMessage("Sending...");

    const response = await fetch("/api/users/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.status === 429) {
      toast.error(data.message);
      setMessage(data.message);
    }else if(response.status === 200){
      toast.success(data.message);
      setMessage(data.message);
    }
     else {
      toast.error(data.message);
      setMessage(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">📩 تحقق من بريدك الإلكتروني</h1>
      <p className="mt-2 text-gray-600">أدخل بريدك الإلكتروني لإعادة إرسال رابط التحقق</p>

      <input
        type="email"
        placeholder="Your Email"
        className="mt-4 px-4 py-2 border rounded w-9/12 lg:w-6/12"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleResend}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        إعادة إرسال رابط التحقق
      </button>

      {message && <p className="mt-4 text-gray-800">{message}</p>}
    </div>
  );
}
