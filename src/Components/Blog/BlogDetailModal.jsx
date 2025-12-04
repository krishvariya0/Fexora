import { IoClose } from "react-icons/io5";

const BlogDetailModal = ({ blog, isOpen, onClose, currentUser, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md transition-opacity "
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {blog.title || "Untitled"}
              </h3>
              <button
                onClick={onClose}
                className="ml-4 h-8 w-8 shrink-0 rounded-full bg-gray-100 p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pb-4 pt-0 sm:p-6 sm:pt-0">
            {/* Image */}
            {blog.image && (
              <div className="mb-6">
                <img
                  src={blog.image}
                  alt={blog.title || "blog image"}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 text-base leading-relaxed">
                {blog.content || "No content"}
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-8 border-t border-gray-200 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <p className="font-medium">
                    Created: {blog.createdAt ? formatDate(blog.createdAt) : "No date"}
                  </p>
                  {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                    <p className="font-medium">
                      Updated: {formatDate(blog.updatedAt)}
                    </p>
                  )}
                </div>

                {currentUser && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(blog)}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Edit Blog
                    </button>
                    <button
                      onClick={() => onDelete(blog.id)}
                      className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete Blog
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
