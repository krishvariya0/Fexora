import { createBrowserRouter } from "react-router-dom";

import ForgetPassword from "./Components/Auth/ForgetPassword";
import Login from "./Components/Auth/Login";
import PasswordReset from "./Components/Auth/PasswordReset";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";
import SignUp from "./Components/Auth/SignUp";
import UserAuth from "./Components/Auth/UserAuth";

import MainLayout from "./Components/layout/layout";
import ProfilePage from "./Components/layout/ProfilePage";

import BlogDetails from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import HomePage from "./pages/HomePage";
import Service from "./pages/Service";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      // {
      //   path: "create-blog",
      //   element: <CreateBlog />,
      // },

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
    element: (
      <PublicRoute>
        <UserAuth />
      </PublicRoute>
    ),
  },
  {
    path: "signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "ForgetPassword",
    element: (
      <PublicRoute>
        <ForgetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "PasswordReset",
    element: (
      <PublicRoute>
        <PasswordReset />
      </PublicRoute>
    ),
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
