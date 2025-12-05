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
            navigate("/auth", { state: { from: "/profile" } });
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
        <nav className="fixed w-full z-50 top-0 left-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-300">
                        Fexora
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
                    <div className="flex items-center bg-gray-50/50 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200">
                            Home
                        </Link>

                        <Link to="/create-blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200">
                            Create Blog
                        </Link>

                        <Link to="/service" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200">
                            Services
                        </Link>

                        <Link to="/contact" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200">
                            Contact
                        </Link>
                    </div>

                    {/* Profile */}
                    <div className="pl-4 border-l border-gray-200">
                        <button
                            onClick={handleProfileClick}
                            className="group relative flex items-center justify-center focus:outline-none"
                            aria-label={user ? "View Profile" : "Sign In"}
                        >
                            {user ? (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md hover:shadow-lg transition-all duration-300">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-sm font-bold text-indigo-700">
                                        {getInitial()}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                                    <CgProfile className="text-2xl" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center gap-4">
                    {/* Profile button for mobile */}
                    <button
                        onClick={handleProfileClick}
                        aria-label={user ? "View Profile" : "Sign In"}
                        className="focus:outline-none"
                    >
                        {user ? (
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-sm">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-700">
                                    {getInitial()}
                                </div>
                            </div>
                        ) : (
                            <CgProfile className="text-2xl text-gray-600" />
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none transition-colors"
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
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-64 opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 py-4 space-y-2 bg-white shadow-inner">
                    <Link
                        to="/"
                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/create-blog"
                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Create Blog
                    </Link>
                    <Link
                        to="/service"
                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Services
                    </Link>
                    <Link
                        to="/contact"
                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;