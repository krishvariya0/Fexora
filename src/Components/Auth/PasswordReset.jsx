import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../utils/auth";

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Firebase reset code from URL
  const oobCode = new URLSearchParams(location.search).get("oobCode");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const { password } = data;

    try {
      // Later we add Firebase confirmPasswordReset(oobCode, password)
      await resetPassword(oobCode, password);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">

      <div className="w-full max-w-lg bg-white border border-gray-300 rounded-xl shadow-md p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Create a New Password
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Your new password must be at least 8 characters long.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-gray-700 text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 hover:bg-gray-600 text-white font-semibold rounded-md transition shadow-sm"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
