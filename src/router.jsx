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

import BlogDetail from "./pages/BlogDetail";
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
        path: "blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-blog",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: "service",
        element: <Service />,
      },
      {
        path: "contact",
        element: <Contact />,
      },

      // Blog details page is already defined above
      // Keeping only one instance of the blog/:id route
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
