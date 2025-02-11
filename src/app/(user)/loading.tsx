import React from "react";

const loadingLoginForm = () => {
  return (
    <section className="fix-height container m-auto px-7 flex items-center justify-center">
    <div className="m-auto bg-white rounded-lg p-5 w-full md:w-2/3">
      <h1 className="text-3xl font-bold text-gray-800 mb-5"></h1>
      <form className="flex flex-col">
        <div className="mb-4 h-12 bg-gray-300 rounded animate-pulse"></div>
        <div className="mb-4 h-12 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-12 bg-blue-300 rounded-lg animate-pulse"></div>
      </form>
    </div>
  </section>
  );
};

export default loadingLoginForm;
