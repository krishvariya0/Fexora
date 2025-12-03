import { createBrowserRouter } from "react-router-dom";

import ForgetPassword from "./Components/Auth/ForgetPassword";
import Login from "./Components/Auth/Login";
import PasswordReset from "./Components/Auth/PasswordReset";
import SignUp from "./Components/Auth/SignUp";
import UserAuth from "./Components/Auth/UserAuth";

import MainLayout from "./Components/layout/layout";
import ProfilePage from "./Components/layout/ProfilePage";

import BlogDetails from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import CreateBlog from "./pages/CreateBlog";
import HomePage from "./pages/HomePage";
import Service from "./pages/Service";

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
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "create-blog",
        element: <CreateBlog />,
      },

      {
        path: "service",
        element: <Service />,
      },

      {
        path: "contact",
        element: <Contact />,
      },

      // Blog details page
      {
        path: "blog/:id",
        element: <BlogDetails />,
      },
    ],
  },

  // AUTH ROUTES
  {
    path: "auth",
    element: <UserAuth />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "ForgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "PasswordReset",
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
