import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import Button from "../Components/layout/button.jsx";

const Contact = () => {
    const [result, setResult] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending...");

        const formData = new FormData(event.target);
        formData.append("access_key", "0ed3c00e-7150-4d5d-9211-046cd8f8fe8a");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setResult("🎉 Message Sent Successfully!");
            event.target.reset();
        } else {
            setResult("❌ Something went wrong, try again!");
        }
    };

    return (
        <div className="min-h-screen py-14 px-4 md:px-10 lg:px-20  flex justify-center">
            <div className="max-w-6xl w-full">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                        Contact Us 📩
                    </h1>
                    <p className="text-gray-600 text-md md:text-lg mt-3 max-w-xl mx-auto">
                        We'd love to hear from you. Fill out the form below!
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* CONTACT INFO */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">📞 Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                    <FiPhone size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Phone</p>
                                    <p className="text-gray-500 text-sm">+91 0000000000</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                    <FiMail size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Email</p>
                                    <p className="text-gray-500 text-sm break-all">variyakrish0@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                    <FiMapPin size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Address</p>
                                    <p className="text-gray-500 text-sm">Surat, Gujarat, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Send a Message</h2>

                        <form onSubmit={onSubmit} className="space-y-5">

                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Your Name"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />

                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Your Email"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />

                            <textarea
                                name="message"
                                required
                                placeholder="Your Message..."
                                className="w-full px-4 py-3 h-36 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            ></textarea>

                            <Button type="submit" className="text-lg hover:scale-[1.03] active:scale-95 transition-transform shadow-lg">
                                <FiSend /> Send Message
                            </Button>
                        </form>

                        {result && (
                            <p className={`text-center font-medium mt-4 ${result.includes("Successfully") ? "text-green-600" : "text-red-600"}`}>
                                {result}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
