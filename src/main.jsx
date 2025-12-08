import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import router from "./router";

const ToastManager = () => {
  useEffect(() => {
    // Clear all existing toasts when component mounts
    toast.dismiss();
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeButton={true}
      hideProgressBar={true}
      newestOnTop={true}
      pauseOnHover={false}
      draggable={false}
      closeOnClick={true}
      limit={3}
      style={{ zIndex: 999999 }}
    />
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <RouterProvider router={router} />

      <ToastManager />
    </>
  </StrictMode>
);
