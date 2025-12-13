import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { FiSave, FiSend } from "react-icons/fi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/layout/button.jsx";
import { createUserBlog, deleteUserBlog, getUserBlogs, updateUserBlog } from "../utils/db";
import { auth } from "../utils/firebase";

const CreateBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [image, setImage] = useState("");
    const fileRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);

        return getUserBlogs(auth.currentUser.uid, (data) => {
            setBlogs(data);
            setLoading(false);
        });
    }, []);

    const submit = async (data) => {
        if (!auth.currentUser) return toast.error("Login first!");

        const blog = {
            ...data,
            image,
            createdAt: Date.now(),
            userId: auth.currentUser.uid,
            userName: auth.currentUser.email.split("@")[0]
        };

        if (editing) {
            await updateUserBlog(auth.currentUser.uid, editing, blog);
            toast.success("Blog updated!");
        } else {
            await createUserBlog(auth.currentUser.uid, blog);
            toast.success("Blog Created!");
        }

        reset();
        setEditing(null);
        setImage("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const removeBlog = async (id) => {
        if (!confirm("Delete blog?")) return;
        await deleteUserBlog(auth.currentUser.uid, id);
        toast.success("Deleted!");
    };

    return (
        <div className="min-h-screen px-4 py-10 md:px-10 ">
            <div className="max-w-[1440px] mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        {editing ? "✏️ Update Your Blog" : "📝 Create Your Blog"}
                    </h1>
                    <p className="text-gray-600 mt-2 md:text-lg">
                        {editing ? "Update and refine your existing blog" : "Share your thoughts with the world"}
                    </p>
                </div>

                {/* Form */}
                <div className="w-full md:w-[90%] lg:w-[850px] mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100">
                    <form onSubmit={handleSubmit(submit)} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blog Title</label>
                            <input
                                {...register("title"
                                    , {
                                        required: { value: true, message: "Blog title is required" },
                                        minLength: { value: 5, message: "minimum 5 characters required" },
                                        maxLength: { value: 100, message: "maximum 100 characters allowed" }
                                    }
                                )}
                                className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter blog title..."
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Blog Content</label>
                            <textarea
                                {...register("content",
                                    {
                                        required: { value: true, message: "Blog content is required" },
                                        minLength: { value: 1000, message: "minimum 1000 characters required" },
                                        maxLength: { value: 5000, message: "maximum 5000 characters allowed" }
                                    })
                                }
                                className="mt-2 w-full px-4 py-3 h-40 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Write your blog..."
                            />
                            {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>}
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
                                <span className="text-xs text-gray-400">JPG, PNG — Max 5MB</span>

                                <input
                                    {...register("image")}
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

                            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>}
                        </div>

                        {image && (
                            <img src={image} className="w-full rounded-xl h-56 object-cover border shadow-md" />
                        )}

                        <Button type="submit">
                            {editing ? <><FiSave /> Update Blog</> : <><FiSend /> Publish Blog</>}
                        </Button>
                    </form>
                </div>

                {/* Blog List */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-12 mb-6">📚 Your Blogs</h2>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/60 backdrop-blur rounded-2xl p-5 shadow-sm">
                                <div className="w-full h-40 bg-gray-200 rounded-xl"></div>
                                <div className="h-4 w-3/4 bg-gray-300 rounded mt-4"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No blogs created yet.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((b) => (
                            <div key={b.id} className="bg-white border shadow-lg rounded-xl p-5 hover:shadow-2xl transition-all">

                                {b.image && <img src={b.image} className="w-full h-48 object-cover rounded-xl mb-4" />}

                                <h3 className="font-semibold text-lg line-clamp-1">{b.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{b.content}</p>

                                <div className="flex justify-between items-center mt-4">
                                    <Link to={`/blog/${b.id}`} className="text-indigo-600 hover:underline text-sm font-semibold">
                                        Read More →
                                    </Link>

                                    <div className="flex gap-3">
                                        <Button variant="icon" onClick={() => {
                                            setEditing(b.id);
                                            setValue("title", b.title);
                                            setValue("content", b.content);
                                            setImage(b.image);
                                        }}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="danger" onClick={() => removeBlog(b.id)}>
                                            <MdDelete />
                                        </Button>
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
