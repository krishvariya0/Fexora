import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import router from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeButton={false}
        hideProgressBar={false}
        newestOnTop={true}
        pauseOnHover={true}
        draggable={true}
        style={{ zIndex: 999999 }}
      />
    </>
  </StrictMode>
);
