"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useTheme } from "next-themes";

const ToastProvider = () => {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
};

export default ToastProvider;
