import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogById, getUserByID } from "../utils/db";

// 🕒 Format the stored timestamp
const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    return new Date(timestamp).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getBlogById(id);

            if (!data) {
                setLoading(false);
                return;
            }

            const user = await getUserByID(data.userId);
            setBlog({ ...data, authorName: user?.name || data.userName });
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen  from-gray-50 to-white px-6 py-10 animate-pulse">
                <div className="max-w-4xl mx-auto">

                    {/* Skeleton Image */}
                    <div className="w-full h-[350px] bg-gray-200 rounded-2xl mb-8"></div>

                    {/* Skeleton title */}
                    <div className="h-8 w-3/4 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-6 w-1/2 bg-gray-300 rounded-lg mb-6"></div>

                    {/* Profile Row */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            <div className="h-3 w-40 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Content lines */}
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-[95%] bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-[90%] bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-[85%] bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-[92%] bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-[75%] bg-gray-200 rounded-md"></div>
                    </div>

                </div>
            </div>
        );
    }


    if (!blog) {
        return (
            <div className="min-h-screen  from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 text-gray-400">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h1>
                    <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  ">

            {/* Navigation */}
            <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition duration-200 group"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Blogs
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">

                {/* Featured Image */}
                {blog.image && (
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                        <img src={blog.image} alt={blog.title} className="w-full h-[500px] object-cover" />
                    </div>
                )}

                {/* Blog Content */}
                <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        {blog.title}
                    </h1>

                    {/* ✍ Author + Date */}
                    <div className="flex items-center mt-6 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r  from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {blog.authorName?.charAt(0)?.toUpperCase() || "A"}
                            </div>

                            <div className="ml-4">
                                <p className="font-semibold text-gray-800">{blog.authorName}</p>

                                <div className="flex items-center mt-1 text-gray-500 text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {/* 👉 NEW DATE DISPLAY */}
                                    <span>Published on {formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {blog.content}
                    </div>
                </article>

                {/* Back to Home */}
                <div className="flex justify-center mt-8">
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ⬅ Return Home
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-8 border-t border-gray-100 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Blog Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default BlogDetail;
