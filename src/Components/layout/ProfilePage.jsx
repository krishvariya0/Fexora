import { useEffect, useState } from "react";
// Added IoPerson, IoMail, IoCalendar for better visual details in the design
import {
    IoCalendarOutline,
    IoCreateOutline,
    IoLogOutOutline,
    IoMailOutline,
    IoPersonOutline
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../utils/auth";
import { auth } from "../../utils/firebase";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                // If user is not logged in, redirect to login page
                navigate("/Login", { state: { from: location.pathname } });
            } else {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, [navigate, location]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Successfully logged out");
            navigate('/');
        } catch (error) {
            toast.error("Failed to log out");
            console.error("Logout error:", error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Get first letter of display name or email for avatar
    const getInitial = () => {
        if (user.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <div className="min-h-screen  flex justify-center items-center px-4 py-10">
            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Decorative Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Content Container */}
                <div className="px-8 pb-8 relative">

                    {/* Avatar (Overlapping the header) */}
                    <div className="relative -mt-16 mb-6 flex justify-center">
                        <div className="h-32 w-32 rounded-full border-4 border-white bg-indigo-50 shadow-lg flex items-center justify-center text-5xl font-bold text-indigo-600">
                            {getInitial()}
                        </div>
                    </div>

                    {/* Header Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {user.displayName || "User Profile"}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Welcome back!</p>
                    </div>

                    {/* User Details Section */}
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4 mb-8 border border-gray-100">

                        {/* Name Field */}
                        {user.displayName && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                                    <IoPersonOutline size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Full Name</p>
                                    <p className="font-semibold">{user.displayName}</p>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        {user.email && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                                    <IoMailOutline size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email Address</p>
                                    <p className="font-semibold break-all">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Date Field */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                                <IoCalendarOutline size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Joined On</p>
                                <p className="font-semibold">
                                    {new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="w-full group flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <IoCreateOutline size={20} className="group-hover:scale-110 transition-transform" />
                            Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full group flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-xl transition-all duration-300"
                        >
                            <IoLogOutOutline size={20} className="group-hover:scale-110 transition-transform" />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;