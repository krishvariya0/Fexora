import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserBlog, deleteUserBlog, getUserBlogs, updateUserBlog } from '../utils/db';
import { auth } from '../utils/firebase';

const CreateBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [imageBase64, setImageBase64] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            content: "",
            image: "",
        },
    });

    // Load user's blogs
    useEffect(() => {
        if (auth.currentUser) {
            setLoading(true);
            const unsubscribe = getUserBlogs(auth.currentUser.uid, (blogs) => {
                setBlogs(blogs);
                setLoading(false);
            });

            // Cleanup subscription on unmount
            return () => {
                if (unsubscribe && typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        if (!auth.currentUser) {
            toast.error("Please log in to create or update blogs");
            return;
        }

        try {
            setLoading(true);
            const getUserDisplayName = () => {
                if (auth.currentUser.displayName) return auth.currentUser.displayName;
                if (auth.currentUser.email) return auth.currentUser.email.split('@')[0];
                return 'User';
            };

            const blogData = {
                title: data.title,
                content: data.content,
                image: imageBase64,
                userId: auth.currentUser.uid,
                userName: getUserDisplayName(),
                authorName: getUserDisplayName(),
                email: auth.currentUser.email || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await updateUserBlog(editingId, blogData);
                toast.success("Blog updated successfully!");
            } else {
                await createUserBlog(blogData);
                toast.success("Blog created successfully!");
            }

            reset();
            setImageBase64("");
            setEditingId(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error("Failed to save blog. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setValue("title", blog.title);
        setValue("content", blog.content);
        setImageBase64(blog.image || "");
        setEditingId(blog.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                setLoading(true);
                await deleteUserBlog(blogId);
                const updatedBlogs = await getUserBlogs(auth.currentUser.uid);
                setBlogs(updatedBlogs);
                toast.success("Blog deleted successfully!");
            } catch (error) {
                console.error("Error deleting blog:", error);
                toast.error("Failed to delete blog");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                        {editingId ? (
                            <span className="text-indigo-600">Edit Your Story</span>
                        ) : (
                            <span>Create <span className="text-indigo-600">New Story</span></span>
                        )}
                    </h1>
                    <p className="text-lg text-gray-600">Share your thoughts with the world.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 border border-gray-100">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    {...register("title", { required: "Title is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
                                    id="title"
                                    type="text"
                                    placeholder="Enter an engaging title..."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Content Textarea */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="content">
                                    Content
                                </label>
                                <textarea
                                    {...register("content", { required: "Content is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 min-h-[200px] resize-y"
                                    id="content"
                                    placeholder="Write your masterpiece here..."
                                />
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {errors.content.message}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="image">
                                    Cover Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-gray-50">
                                    <div className="space-y-1 text-center">
                                        {imageBase64 ? (
                                            <div className="relative group">
                                                <img
                                                    src={imageBase64}
                                                    alt="Preview"
                                                    className="mx-auto h-64 object-cover rounded-md shadow-md"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                    <p className="text-white font-medium">Click 'Choose File' to change</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}

                                        <div className="flex text-sm text-gray-600 justify-center mt-4">
                                            <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span className="px-2">Upload a file</span>
                                                <input
                                                    {...register("image")}
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    className="sr-only"
                                                    ref={(e) => {
                                                        register("image").ref(e);
                                                        fileInputRef.current = e;
                                                    }}
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Publishing...
                                        </>
                                    ) : (
                                        editingId ? 'Update Story' : 'Publish Story'
                                    )}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditingId(null);
                                            setImageBase64("");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Blog List Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-3xl font-bold text-gray-900">Your Stories</h2>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {blogs.length} {blogs.length === 1 ? 'Post' : 'Posts'}
                        </span>
                    </div>

                    {loading && blogs.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900">No stories yet</h3>
                            <p className="mt-1 text-gray-500">Get started by creating your first blog post above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
                                    <div className="relative overflow-hidden h-48 bg-gray-200">
                                        {blog.image ? (
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                                <svg className="h-12 w-12 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                                            {blog.content}
                                        </p>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(blog)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-indigo-100 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-100 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;