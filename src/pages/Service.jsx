import {
    FaBullhorn,
    FaLaptopCode,
    FaMobileAlt,
    FaPenNib,
    FaSearch,
    FaServer
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Service = () => {
    const services = [
        {
            icon: <FaLaptopCode className="text-4xl" />,
            title: "Web Development",
            desc: "Custom websites and scalable web apps tailored to your business."
        },
        {
            icon: <FaMobileAlt className="text-4xl" />,
            title: "Mobile App Development",
            desc: "High-performance Android & iOS apps built with modern mobile frameworks."
        },
        {
            icon: <FaPenNib className="text-4xl" />,
            title: "UI / UX Design",
            desc: "Beautiful and intuitive designs that enhance user experience."
        },
        {
            icon: <FaBullhorn className="text-4xl" />,
            title: "Digital Marketing",
            desc: "Boost brand awareness with SEO, ads, and social marketing strategies."
        },
        {
            icon: <FaServer className="text-4xl" />,
            title: "Cloud & Backend",
            desc: "Secure and scalable backend infrastructure with cloud deployment."
        },
        {
            icon: <FaSearch className="text-4xl" />,
            title: "SEO Optimization",
            desc: "Improve visibility, rank higher, and attract organic traffic."
        },
    ];

    return (
        <div className="min-h-screen ">

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-sm leading-tight">
                    Our Expert Services 🚀
                </h1>
                <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                    We craft digital solutions that help businesses transform and grow with confidence.
                </p>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-6 py-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 cursor-pointer group"
                    >
                        <div className="flex flex-col items-center gap-5 text-center">
                            <div className="p-6 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                {service.title}
                            </h3>

                            <p className="text-gray-500 leading-relaxed">
                                {service.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="mt-20 mb-16 text-center px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Ready to Start Your Project?
                </h2>
                <p className="text-gray-600 mt-3 mb-6 max-w-xl mx-auto">
                    Let’s build something impactful together — from idea to launch.
                </p>

                <Link to="/contact" className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg">
                    Contact Us
                </Link>
            </section>
        </div>
    );
};

export default Service;
