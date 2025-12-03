import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            navigate("/login", { state: { from: "/profile" } });
        }
    };

    const getInitial = () => {
        if (!user) return null;

        if (user.displayName)
            return user.displayName.charAt(0).toUpperCase();

        if (user.email)
            return user.email.charAt(0).toUpperCase();

        return "U";
    };

    return (
        <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-default backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

                {/* Brand */}
                <Link to="/" className="text-2xl font-semibold text-heading tracking-wide">
                    Fexora
                </Link>

                {/* Menu */}
                <div className="hidden md:flex items-center space-x-8">

                    <Link to="/" className="text-fg-brand font-medium hover:text-brand transition">
                        Home
                    </Link>

                    <Link to="/create-blog" className="text-heading font-medium hover:text-fg-brand transition">
                        Create Blog
                    </Link>

                    <Link to="/service" className="text-heading font-medium hover:text-fg-brand transition">
                        Services
                    </Link>

                    <Link to="/contact" className="text-heading font-medium hover:text-fg-brand transition">
                        Contact
                    </Link>

                    {/* Profile */}
                    <button
                        onClick={handleProfileClick}
                        className="ml-4"
                        aria-label={user ? "View Profile" : "Sign In"}
                    >
                        {user ? (
                            <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-800 hover:bg-gray-400 transition">
                                {getInitial()}
                            </div>
                        ) : (
                            <CgProfile className="text-heading text-2xl hover:text-fg-brand transition" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
