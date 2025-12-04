// HomePage.jsx — Display all blogs
import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBlogs, getUserByID } from '../utils/db';
import { auth } from '../utils/firebase';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Function to fetch author details for a blog
  const fetchAuthorDetails = useCallback(async (blog) => {
    try {
      if (blog.userId) {
        const userData = await getUserByID(blog.userId);
        if (userData && (userData.displayName || userData.name)) {
          return userData.displayName || userData.name;
        }
      }
      return blog.authorName || blog.userName || 'User';
    } catch (error) {
      console.error(`Error fetching author for blog ${blog.id}:`, error);
      return blog.authorName || blog.userName || 'User';
    }
  }, []);

  // Fetch all blogs with author details
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const allBlogs = await getAllBlogs();
        
        // Fetch author details for each blog
        const blogsWithAuthors = await Promise.all(
          allBlogs.map(async (blog) => {
            const authorName = await fetchAuthorDetails(blog);
            return { ...blog, displayAuthorName: authorName };
          })
        );
        
        // Sort blogs by creation date (newest first)
        const sortedBlogs = blogsWithAuthors.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [fetchAuthorDetails]);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate text to a certain length
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Latest Blog Posts
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover amazing stories, thinking, and expertise from our community
          </p>
          {currentUser ? (
            <div className="mt-6">
              <Link
                to="/create-blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Write a Blog Post
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in to Create a Blog
              </Link>
            </div>
          )}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              {currentUser ? (
                <>
                  Get started by{' '}
                  <Link to="/create-blog" className="text-blue-600 hover:text-blue-500">
                    creating a new blog post
                  </Link>
                  .
                </>
              ) : (
                'Sign in to create your first blog post.'
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                {blog.image && (
                  <div className="shrink-0 h-48">
                    <img
                      className="h-full w-full object-cover"
                      src={blog.image}
                      alt={blog.title}
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link
                      to={`/blog/${blog.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-90 transition-opacity"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {truncateText(blog.content)}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="shrink-0">
                      <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {blog.displayAuthorName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {blog.displayAuthorName || 'User'}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={blog.createdAt}>
                          {formatDate(blog.createdAt)}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{Math.ceil(blog.content?.length / 200) || 2} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
