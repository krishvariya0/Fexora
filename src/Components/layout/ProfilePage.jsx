import { useEffect, useState } from "react";
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
                navigate("/Login", { state: { from: location.pathname } });
            } else {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logged Out Successfully");
            navigate("/");
        } catch {
            toast.error("Logout Failed");
        }
    };

    if (!user) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-100">
                <div className="animate-spin border-4 border-gray-300 border-t-indigo-600 w-10 h-10 rounded-full"></div>
            </div>
        );
    }

    const initial = (user.displayName || user.email)[0].toUpperCase();

    return (
        <div className="min-h-screen flex justify-center  px-4 py-12">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header Banner */}
                <div className="h-36 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Avatar */}
                <div className="-mt-7 flex justify-center">
                    <div className="h-28 w-28 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center text-4xl font-bold text-indigo-600">
                        {initial}
                    </div>
                </div>

                {/* User Name */}
                <div className="text-center mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">{user.displayName || "User"}</h1>
                    <p className="text-gray-500 text-sm mt-1">⭐ Verified Member</p>
                </div>

                {/* Details Section */}
                <div className="px-8 mt-6 space-y-5">
                    {[
                        {
                            label: "Full Name",
                            icon: <IoPersonOutline size={20} className="text-indigo-600" />,
                            value: user.displayName || "Not Added"
                        },
                        {
                            label: "Email Address",
                            icon: <IoMailOutline size={20} className="text-indigo-600" />,
                            value: user.email
                        },
                        {
                            label: "Member Since",
                            icon: <IoCalendarOutline size={20} className="text-indigo-600" />,
                            value: new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                        >
                            <div className="p-3 bg-white rounded-xl shadow-sm">{item.icon}</div>
                            <div>
                                <p className="text-xs tracking-wider text-gray-400 uppercase">{item.label}</p>
                                <p className="mt-1 text-gray-800 font-semibold break-all">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="px-8 py-10 space-y-4">
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 font-medium"
                    >
                        <IoCreateOutline size={18} />
                        Edit Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 text-red-600 font-medium border border-red-200 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2"
                    >
                        <IoLogOutOutline size={18} />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

