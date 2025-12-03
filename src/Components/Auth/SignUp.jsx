import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoIosReturnLeft } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signUpWithEmailAndPassword, signUpWithGoogle } from "../../utils/auth";
import { createUser, getUserByID } from "../../utils/db";

const SignUp = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const handleGoogle = async () => {
        try {
            const response = await signUpWithGoogle();
            console.log("res", response);

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
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (error) {
            toast.error("Google login failed!");
        }
    };




    const onSubmit = (data) => {
        console.log("data", data);

        signUpWithEmailAndPassword(data.email, data.password).then(async (response) => {
            console.log("response", response?.user);
            if (response?.user) {
                const user = {
                    uid: response?.user?.uid,
                    photoURL: response?.user?.photoURL,
                    name: data?.fullname,
                    email: response?.user?.email?.toLowerCase(),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    lastLogedInAt: Date.now(),
                    role: "user",
                    status: "active",
                }
                const res = await createUser(user);

                console.log("res", res);

                toast.success("Account created successfully!");

                setTimeout(() => navigate("/"), 2000);
            }


        }).catch((error) => {
            console.log("error", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("User already exists!");
            }
        }).finally(() => { });
    };




    const password = watch("password");

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">

            <div className="w-full max-w-lg bg-white border border-gray-300 rounded-xl shadow-md p-8">

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
                    Create Your Fexora Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-gray-700 text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                            {...register("fullname", { required: "Full name is required" })}
                        />
                        {errors.fullname && (
                            <p className="text-red-600 text-sm">{errors.fullname.message}</p>
                        )}
                    </div>

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
                            placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gray-800 hover:bg-gray-600 text-white font-semibold rounded-md transition shadow-sm"
                    >
                        Create Account
                    </button>




                </form>
                <p className="text-center text-gray-700 text-sm mt-2">OR</p>
                <div>

                    <button
                        onClick={handleGoogle}
                        className="flex mt-2 items-center justify-center w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800 bg-white hover:bg-gray-100">
                        <FcGoogle className="mr-2" />
                        Continue with Google
                    </button>
                </div>

                {/* Already Have Account? */}
                <p className="text-center text-gray-700 text-sm mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium underline hover:text-gray-900">
                        Log In
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

export default SignUp;
