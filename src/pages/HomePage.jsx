// HomePage.jsx — Fixed, stable real-time blog manager
import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserBlog, deleteUserBlog, getUserBlogs, updateUserBlog } from "../utils/db";
import { auth } from "../utils/firebase";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const mountedRef = useRef(true);
  const fileReaderRef = useRef(null);

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  // User authentication state management
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Real-time listener for user-specific blogs ---
  useEffect(() => {
    if (userLoading || !currentUser) {
      setBlogs([]);
      setFetchLoading(false);
      return;
    }

    mountedRef.current = true;
    setFetchLoading(true);

    const unsubscribe = getUserBlogs(currentUser.uid, (blogList) => {
      if (!mountedRef.current) return;
      setBlogs(blogList);
      setFetchLoading(false);
    });

    return () => {
      mountedRef.current = false;
      if (unsubscribe) unsubscribe();
      // cleanup FileReader handlers to avoid leaks
      if (fileReaderRef.current) {
        fileReaderRef.current.onload = null;
        fileReaderRef.current.onerror = null;
      }
    };
  }, [currentUser, userLoading]);

  // IMAGE HANDLER
  const handleImage = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // validate type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        e.target.value = "";
        return;
      }

      // limit size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }

      setImageUploading(true);
      const reader = new FileReader();
      fileReaderRef.current = reader;

      reader.onloadend = () => {
        try {
          const result = reader.result;
          setImageBase64(result);
          setValue("image", result);
          clearErrors("image");
        } catch (err) {
          console.error("Error processing image:", err);
          toast.error("Failed to process image");
        } finally {
          setImageUploading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read image file");
        setImageUploading(false);
        e.target.value = "";
      };

      reader.readAsDataURL(file);
    },
    [setValue, clearErrors]
  );

  // CREATE / UPDATE
  const onSubmit = async (data) => {
    // Check if user is authenticated
    if (!currentUser) {
      toast.error("Please login to create or update blogs");
      return;
    }

    // protect against double actions
    if (loading || isSubmitting) return;

    setLoading(true);
    clearErrors();
    let hasError = false;

    // basic validations
    if (!data.title || !data.title.trim()) {
      setError("title", { message: "Title is required" });
      hasError = true;
    }
    if (!data.content || !data.content.trim()) {
      setError("content", { message: "Content is required" });
      hasError = true;
    }
    // require image only when creating
    if (!editingId && !data.image) {
      setError("image", { message: "Image is required" });
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fix errors before submitting");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // if user didn't change image, data.image will contain existing image (we set it on edit)
        const existing = blogs.find((b) => b.id === editingId);
        const updatePayload = {
          title: data.title.trim(),
          content: data.content.trim(),
          image: data.image || existing?.image || "",
        };
        await updateUserBlog(currentUser.uid, editingId, updatePayload);
        toast.success("Blog updated successfully");
        setEditingId(null);
      } else {
        await createUserBlog(currentUser.uid, {
          title: data.title.trim(),
          content: data.content.trim(),
          image: data.image,
        });
        toast.success("Blog created successfully");
      }

      // reset form UI
      reset();
      setImageBase64("");
      // no need to manually fetch — realtime listener updates list
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage =
        err?.code === "permission-denied"
          ? "Permission denied. Check Firebase rules."
          : err?.message || "Failed to save blog";
      toast.error(errorMessage);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!currentUser) {
      toast.error("Please login to delete blogs");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteUserBlog(currentUser.uid, id);
      toast.success("Blog deleted");
      // realtime listener will update list
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete blog");
    }
  };

  // START EDIT
  const handleEdit = useCallback(
    (blog) => {
      try {
        setEditingId(blog.id);
        setValue("title", blog.title || "");
        setValue("content", blog.content || "");
        setValue("image", blog.image || "");
        setImageBase64(blog.image || "");
        clearErrors();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Edit error:", err);
        toast.error("Failed to start edit");
      }
    },
    [setValue, clearErrors]
  );

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
    setImageBase64("");
    clearErrors();
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <>
      <div className="min-h-screen ">
        <ToastContainer position="top-right" />

        {/* User authentication status */}
        {userLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
          </div>
        ) : !currentUser ? (
          <div className="flex justify-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Please login to manage your blogs.
            </div>
          </div>
        ) : (
          /* FORM */
          <div className="w-full flex justify-center py-12">
            <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-8 w-full max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                {editingId ? "Update Blog" : "Create New Blog"}
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Title */}
                <div>
                  <label className="font-medium text-gray-700">Title</label>
                  <input
                    {...register("title")}
                    placeholder="Blog title"
                    disabled={loading || isSubmitting}
                    className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Content */}
                <div>
                  <label className="font-medium text-gray-700">Content</label>
                  <textarea
                    {...register("content")}
                    placeholder="Write your blog..."
                    rows={6}
                    disabled={loading || isSubmitting}
                    className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                </div>

                {/* Hidden image field for RHF */}
                <input type="hidden" {...register("image")} />

                {/* Image upload */}
                <div>
                  <label className="font-medium text-gray-700">Image</label>
                  <label
                    htmlFor="image-upload"
                    className={`mt-2 block w-full h-56 border-2 border-dashed rounded-lg overflow-hidden relative text-center
                  ${imageUploading ? "opacity-60" : "hover:bg-gray-100"}`
                    }
                  >
                    {imageUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
                      </div>
                    )}

                    {imageBase64 && !imageUploading ? (
                      <img src={imageBase64} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <span>{imageUploading ? "Processing..." : "Click to upload image (max 5MB)"}</span>
                      </div>
                    )}
                  </label>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    disabled={loading || isSubmitting || imageUploading}
                    className="hidden"
                  />

                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || isSubmitting || imageUploading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-60"
                  >
                    {loading || isSubmitting ? "Processing..." : editingId ? "Update Blog" : "Create Blog"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading || isSubmitting}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="max-w-[1440px] mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Blog Posts</h2>

        <div className="mb-4 text-sm text-gray-600">
          <span>Fetch loading: {fetchLoading ? "Yes" : "No"}</span>
          <span className="mx-3">|</span>
          <span>Count: {blogs.length}</span>
        </div>

        {fetchLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No posts yet — create your first blog above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="w-full h-75 sm:h-40  sm:max-w-[320px] bg-gray-100">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title || "blog image"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4 h-60 ">
                  <h3 className="text-lg font-semibold text-gray-800">{blog.title || "Untitled"}</h3>
                  <p className="text-gray-600 mt-2">{blog.content || "No content"}</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "No date"}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={loading}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

        )}
      </div>

    </>

  );
};

export default HomePage;
