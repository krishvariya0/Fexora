import { createBrowserRouter } from "react-router-dom";

// Layout

// Auth Page
import UserAuth from "./Components/Auth/UserAuth";

// Pages
import ForgetPassword from "./Components/Auth/ForgetPassword";
import Login from "./Components/Auth/Login";
import PasswordReset from "./Components/Auth/PasswordReset";
import SignUp from "./Components/Auth/SignUp";
import HomePage from "./Components/layout/HomePage";
import MainLayout from "./Components/layout/layout";
import ProfilePage from "./Components/layout/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/ProfilePage",
        element: <ProfilePage />,
      },


    ],
  },

  {
    path: "/auth",
    element: <UserAuth />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/ForgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/PasswordReset",
    element: <PasswordReset />,
  },




  // 404
  {
    path: "*",
    element: (
      <h1 className="text-heading text-center mt-20 text-3xl">
        404 Page Not Found
      </h1>
    ),
  },
]);

export default router;
