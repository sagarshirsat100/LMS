import React, {useEffect} from "react";
import {useParams, useNavigate} from 'react-router-dom'

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate("/${path}");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="aspect-square w-16 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-400 sm:w-20"></div>
    </div>
  );
};

export default Loading;
