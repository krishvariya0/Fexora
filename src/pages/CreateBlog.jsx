import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { FiSave, FiSend } from "react-icons/fi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { createUserBlog, deleteUserBlog, getUserBlogs, updateUserBlog } from "../utils/db";
import { auth } from "../utils/firebase";

const CreateBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [image, setImage] = useState("");
    const fileRef = useRef(null);

    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (!auth.currentUser) return;
        setLoading(true);

        return getUserBlogs(auth.currentUser.uid, (data) => {
            setBlogs(data);
            setLoading(false);
        });
    }, []);

    const submit = async (data) => {
        if (!auth.currentUser) return alert("Login first!");

        const blog = {
            ...data,
            image,
            createdAt: Date.now(),
            userId: auth.currentUser.uid,
            userName: auth.currentUser.email.split("@")[0]
        };

        if (editing) {
            await updateUserBlog(auth.currentUser.uid, editing, blog);
            alert("Blog updated!");
        } else {
            await createUserBlog(auth.currentUser.uid, blog);
            alert("Blog Created!");
        }

        reset();
        setEditing(null);
        setImage("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const removeBlog = async (id) => {
        if (!confirm("Delete blog?")) return;
        await deleteUserBlog(auth.currentUser.uid, id);
        alert("Deleted!");
    };

    return (
        <div className="min-h-screen py-8 px-4 md:px-10 lg:px-20">
            <div className="max-w-[1440px] mx-auto">

                {/* Page Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        {editing ? "✏️ Edit Blog" : "📝 Create Blog"}
                    </h1>
                    <p className="text-gray-600 mt-2 md:text-lg">
                        {editing ? "Update your blog post below" : "Share your idea with the world"}
                    </p>
                </div>

                {/* Blog Form */}
                <div className="w-full md:w-[90%] lg:w-[850px] mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 mb-16">
                    <form onSubmit={handleSubmit(submit)} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blog Title</label>
                            <input
                                {...register("title")}
                                className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your blog title..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blog Content</label>
                            <textarea
                                {...register("content")}
                                className="mt-2 w-full px-4 py-3 h-40 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Write here..."
                            />
                        </div>

                        {/* Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Featured Image</label>

                            <label
                                htmlFor="upload"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 mt-2 cursor-pointer hover:border-indigo-500 transition"
                            >
                                <HiOutlinePhoto className="text-4xl text-indigo-600" />
                                <p className="text-gray-600 font-medium mt-2">Upload Image</p>
                                <span className="text-xs text-gray-400">JPG, PNG, Max 5MB</span>

                                <input
                                    id="upload"
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const reader = new FileReader();
                                        reader.onload = () => setImage(reader.result);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Preview */}
                        {image && (
                            <img src={image} className="w-full rounded-xl h-56 object-cover border shadow-md" />
                        )}

                        {/* Submit Button */}
                        <button className="w-full py-3 rounded-xl text-white flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-xl">
                            {editing ? <><FiSave /> Save Changes</> : <><FiSend /> Publish Blog</>}
                        </button>
                    </form>
                </div>

                {/* Blog List */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">📚 Your Blogs</h2>

                {/* Skeleton Loader */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/50 backdrop-blur rounded-2xl p-5 shadow-sm">
                                <div className="w-full h-40 bg-gray-200 rounded-xl mb-3"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="flex gap-2 justify-end">
                                    <div className="h-9 w-9 bg-gray-200 rounded-xl"></div>
                                    <div className="h-9 w-9 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No blogs yet. Start writing!</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((b) => (
                            <div key={b.id} className="bg-white border shadow-lg rounded-xl p-5 transition-all hover:shadow-2xl hover:-translate-y-1">

                                {b.image && <img src={b.image} className="w-full h-48 object-cover rounded-xl mb-4" />}

                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{b.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{b.content}</p>

                                <div className="flex justify-between items-center mt-4">
                                    <Link to={`/blog/${b.id}`} className="text-indigo-600 hover:underline text-sm font-semibold">
                                        Read More →
                                    </Link>

                                    <div className="flex gap-3">
                                        <button onClick={() => {
                                            setEditing(b.id);
                                            setValue("title", b.title);
                                            setValue("content", b.content);
                                            setImage(b.image);
                                        }} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition">
                                            <FaEdit />
                                        </button>

                                        <button onClick={() => removeBlog(b.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateBlog;
