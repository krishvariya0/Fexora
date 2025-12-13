import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgetPassword } from "../../utils/auth";
import { getUserByEmail } from "../../utils/db";
import Button from "../layout/button.jsx";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try{
        const findUser = await getUserByEmail(data?.email?.toLowerCase());

        if(!findUser){
            toast.error("No account found with this email, Please double check your email!");
            return;
        }


        await forgetPassword(data.email)
        toast.success("Password reset link sent to your email!");
    }catch(error){
        if(error.code === "auth/user-not-found"){
            toast.error("No account found with this email!");
        }else{
            toast.error(error.message);
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">

      <div className="w-full max-w-lg bg-white border border-gray-300 rounded-xl shadow-md p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Reset Your Password
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Enter the email associated with your account and we’ll send you a reset link.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-gray-700 text-sm font-medium">Confirm Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit button */}
          <Button type="submit" variant="secondary">
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-gray-700 text-sm mt-6">
          Remember your password?{" "}
          <Link to="/login" className="font-medium underline hover:text-gray-900">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgetPassword;
