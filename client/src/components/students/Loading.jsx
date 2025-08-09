import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="aspect-square w-16 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-400 sm:w-20"></div>
    </div>
  );
};

export default Loading;
