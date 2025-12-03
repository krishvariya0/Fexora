import { useEffect, useState } from "react";
import { IoCreateOutline, IoLogOutOutline } from "react-icons/io5";
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
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
        <div className="min-h-screen flex justify-center px-4 py-20 ">
            <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-md p-8">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Your Profile
                </h1>

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                        {getInitial()}
                    </div>
                </div>

                {/* User Details */}
                <div className="space-y-4 text-center mb-8">
                    {user.displayName && (
                        <p className="text-xl font-semibold text-gray-800">
                            {user.displayName}
                        </p>
                    )}
                    {user.email && (
                        <p className="text-gray-600">{user.email}</p>
                    )}
                    <p className="text-sm text-gray-500">
                        Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition"
                    >
                        <IoCreateOutline size={20} />
                        Edit Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-md transition"
                    >
                        <IoLogOutOutline size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
