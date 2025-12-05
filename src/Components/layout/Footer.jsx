import { FaGithub, FaHeart, FaLinkedin } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io5';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="https://github.com/krishvariya0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">GitHub</span>
                            <FaGithub className="h-6 w-6" />
                        </a>
                        <a href="https://www.instagram.com/krxsh.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                            <span className="sr-only">Twitter</span>
                            <IoLogoInstagram className="h-6 w-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/krish-variya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                            <span className="sr-only">LinkedIn</span>
                            <FaLinkedin className="h-6 w-6" />
                        </a>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-500">
                            &copy; {currentYear} Fexora. All rights reserved.
                        </p>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Made with <FaHeart className="inline text-red-500" /> by Krish Variya
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
