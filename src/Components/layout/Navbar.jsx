import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <div className="max-w-7xl mx-auto flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-8">

                {/* Brand */}
                <Link to="/" className="text-xl sm:text-2xl font-semibold text-heading tracking-wide">
                    Fexora
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">

                    <Link to="/" className="text-fg-brand font-medium hover:text-brand transition text-sm lg:text-base">
                        Home
                    </Link>

                    {/* <Link to="/create-blog" className="text-heading font-medium hover:text-fg-brand transition">
                        Create Blog
                    </Link> */}

                    <Link to="/service" className="text-heading font-medium hover:text-fg-brand transition text-sm lg:text-base">
                        Services
                    </Link>

                    <Link to="/contact" className="text-heading font-medium hover:text-fg-brand transition text-sm lg:text-base">
                        Contact
                    </Link>

                    {/* Profile */}
                    <button
                        onClick={handleProfileClick}
                        className="ml-2 lg:ml-4"
                        aria-label={user ? "View Profile" : "Sign In"}
                    >
                        {user ? (
                            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gray-300 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-400 transition">
                                {getInitial()}
                            </div>
                        ) : (
                            <CgProfile className="text-heading text-xl lg:text-2xl hover:text-fg-brand transition" />
                        )}
                    </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center space-x-3">
                    {/* Profile button for mobile */}
                    <button
                        onClick={handleProfileClick}
                        aria-label={user ? "View Profile" : "Sign In"}
                        className="p-1"
                    >
                        {user ? (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-800 hover:bg-gray-400 transition">
                                {getInitial()}
                            </div>
                        ) : (
                            <CgProfile className="text-heading text-xl hover:text-fg-brand transition" />
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <HiX className="h-6 w-6" />
                        ) : (
                            <HiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/service"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Services
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
