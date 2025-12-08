import { AiFillCaretRight } from "react-icons/ai";
import { IoIosReturnLeft } from "react-icons/io";
import { Link } from "react-router";

function AuthModel() {
    return (
        <div className="w-full flex justify-center mt-12 mb-24 px-4">

            {/* MAIN CARD */}
            <div className="w-full max-w-lg bg-white border border-gray-300 rounded-xl shadow-md p-8">

                {/* TITLE */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 text-center">
                    Welcome to Fexora
                </h1>

                {/* SIGN IN SECTION */}
                <div className="mt-8 text-center">
                    <p className="text-gray-700 mb-3 font-medium">
                        Already have a Fexora account?
                    </p>

                    <Link
                        to="/login"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-md shadow-sm transition inline-block"
                    >
                        Continue to Sign In
                    </Link>
                </div>

                {/* DIVIDER */}
                <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* CREATE ACCOUNT */}
                <div className="text-center">
                    <p className="text-gray-700 mb-3 font-medium">
                        Create your Fexora account
                    </p>
                    <Link
                        to="/SignUp"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-md shadow-sm transition inline-block"
                    >
                        Create Account
                    </Link>
                </div>

                {/* BENEFITS BOX */}
                <div className="mt-10 border border-gray-200 bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Your Fexora Creator Benefits
                    </h3>

                    <ul className="space-y-3 text-gray-700 text-[15px]">

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            Publish blog posts instantly
                        </li>

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            Manage & edit your content any time
                        </li>

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            Grow your audience with analytics insights
                        </li>

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            Add images, tags, categories & SEO metadata
                        </li>

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            Get personalized writing suggestions & tools
                        </li>

                        <li className="flex items-center gap-2 leading-tight">
                            <AiFillCaretRight className="text-gray-700 text-base" />
                            And much more — future monetization included
                        </li>

                    </ul>
                </div>

                {/* BACK TO HOME */}
                <Link
                    to="/"
                    className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
                >
                    <IoIosReturnLeft className="text-lg" />
                    Back to Home
                </Link>

            </div>
        </div>
    );
}

export default AuthModel;
