import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBlogsRealtime, getUserByID } from "../utils/db";
import { auth } from "../utils/firebase";

// --- Helper: Format Date ---
const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown Date";
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- Helper: Skeleton Loader Component ---
const BlogSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="flex flex-col gap-1 w-24">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check Login State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch Blogs
  // Fetch ALL blogs live from all users
  useEffect(() => {
    const unsubscribe = getAllBlogsRealtime(async (allBlogs) => {

      const withAuthors = await Promise.all(
        allBlogs.map(async (b) => {
          const u = await getUserByID(b.userId);
          return { ...b, authorName: u?.name || b.userName || "Anonymous" };
        })
      );

      setBlogs(withAuthors);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="min-h-screen  font-[Inter] pb-20">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-6 text-center mb-12">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase mb-4">
            Our Community
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="text-black bg-clip-text  from-indigo-600 to-purple-600">Discover Stories & Ideas</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Read insightful articles, share your knowledge, and connect with a community of developers and writers.
          </p>

          {/* CTA Button */}
          {user ? (
            <Link
              to="/create-blog"
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              <span>Write a Blog</span>
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <div className="inline-flex items-center bg-gray-100 rounded-full px-5 py-2 text-sm text-gray-600">
              <span>Join the conversation?</span>
              <Link to="/login" className="ml-2 font-bold text-indigo-600 hover:underline">
                Login here
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="max-w-7xl mx-auto px-6">

        {/* Loading State */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="text-gray-500 mt-1">Be the first to share your story!</p>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <Link
              key={b.id}
              to={`/blog/${b.id}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                {b.image ? (
                  <img
                    src={b.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={b.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                  </div>
                )}
                {/* Overlay Date Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
                  {formatDate(b.createdAt).split(",")[0]}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
                  {b.title}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                  {b.content}
                </p>

                {/* Footer / Author */}
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4 mt-auto">
                  {/* Avatar Placeholder */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r  from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {b.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {b.authorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Author
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;