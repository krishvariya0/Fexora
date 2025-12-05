import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";

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
            setResult("Message Sent Successfully! 🎉");
            event.target.reset();
        } else {
            setResult("Something went wrong ❌");
        }
    };

    return (
        <div className="min-h-screen  from-white to-gray-100 py-16 px-6">

            {/* PAGE HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900">Contact Us 📩</h1>
                <p className="text-gray-600 text-lg mt-2 max-w-xl mx-auto">
                    We'd love to hear from you. Fill out the form below!
                </p>
            </div>

            {/* GRID LAYOUT */}
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

                {/* CONTACT DETAILS */}
                <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                <FiPhone size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Phone</p>
                                <p className="text-gray-500 text-sm">+91 0000000000</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                <FiMail size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Email</p>
                                <p className="text-gray-500 text-sm">variyakrish0@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                                <FiMapPin size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Address</p>
                                <p className="text-gray-500 text-sm">Surat, Gujarat, India</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 h-56 rounded-xl bg-gray-200 flex items-center justify-center">
                        🗺 Map Preview
                    </div>
                </div>

                {/* CONTACT FORM */}
                <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <textarea
                            name="message"
                            required
                            placeholder="Message..."
                            className="w-full px-4 py-3 h-40 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        ></textarea>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white text-lg  from-indigo-600 to-purple-600 hover:scale-[1.02] transition shadow-lg"
                        >
                            <FiSend /> Send Message
                        </button>
                    </form>

                    {result && (
                        <p className="text-center text-indigo-600 font-medium mt-4">{result}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
