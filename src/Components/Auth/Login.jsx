import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoIosReturnLeft } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { signInWithEmail, signUpWithGoogle } from "../../utils/auth";
import { createUser, getUserByID } from "../../utils/db";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the redirect path from location state or default to '/'
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const handaleGoogle = async () => {
        try {
            const response = await signUpWithGoogle();
            if (response?.user) {
                const findUser = await getUserByID(response?.user?.uid);
                console.log("findUser", findUser)
                if (!findUser) {
                    const user = {
                        uid: response?.user?.uid,
                        photoURL: response?.user?.photoURL,
                        name: response?.user?.displayName,
                        email: response?.user?.email?.toLowerCase(),
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        lastLogedInAt: Date.now(),
                        role: "user",
                        status: "active",
                    }

                    const res = await createUser(user);
                }



                toast.success("Logged in with Google!");
                setTimeout(() => navigate(from, { replace: true }), 1500);
            }
        } catch (error) {
            toast.error("Google login failed!");
        }
    };

    const onSubmit = async ({ email, password }) => {
        const setDisabled = (value) => {
            setDisabled(value);
            setTimeout(() => setDisabled(true), 3000);
        };

        try {
            const response = await signInWithEmail(email, password);
            console.log("Login Response:", response);

            toast.success("Login Successful!");

            setTimeout(() => navigate(from, { replace: true }), 2000);

        } catch (error) {
            console.log("Login Error:", error);

            if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                toast.error("Invalid email or password!");
            } else if (error.code === "auth/user-not-found") {
                toast.error("Account does not exist!");
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">

            {/* CARD */}
            <div className="w-full max-w-lg bg-white border border-gray-300 rounded-xl shadow-md p-8">

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
                    Login to Fexora
                </h1>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-gray-700 text-sm font-medium">Email</label>
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

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-gray-700 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            to="/ForgetPassword"
                            className="text-sm text-gray-700 hover:text-gray-900 underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gray-800 hover:bg-gray-600 text-white font-semibold rounded-md transition shadow-sm"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-700 text-sm mt-2">OR</p>
                <div>

                    <button
                        onClick={handaleGoogle}
                        className="flex mt-2 items-center justify-center w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800 bg-white hover:bg-gray-100">
                        <FcGoogle className="mr-2" />
                        Continue with Google
                    </button>
                </div>

                {/* Create Account */}
                <p className="text-center text-gray-700 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="font-medium underline hover:text-gray-900">
                        Sign Up
                    </Link>
                </p>

                <Link
                    to="/auth"
                    className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
                >
                    <IoIosReturnLeft className="text-lg" />
                    Back to Auth
                </Link>

            </div>
            <ToastContainer />

        </div>
    );
};

export default Login;
