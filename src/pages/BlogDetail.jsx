
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBlogById, getUserByID } from '../utils/db';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [authorName, setAuthorName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogData = await getBlogById(id);
        if (blogData) {
          setBlog(blogData);
          
          // Fetch author's display name
          if (blogData.userId) {
            try {
              const userData = await getUserByID(blogData.userId);
              if (userData && (userData.displayName || userData.name)) {
                setAuthorName(userData.displayName || userData.name);
              } else if (blogData.authorName || blogData.userName) {
                setAuthorName(blogData.authorName || blogData.userName);
              }
            } catch (err) {
              console.error('Error fetching author details:', err);
              // Fall back to blog's stored author name if available
              if (blogData.authorName || blogData.userName) {
                setAuthorName(blogData.authorName || blogData.userName);
              }
            }
          } else if (blogData.authorName || blogData.userName) {
            setAuthorName(blogData.authorName || blogData.userName);
          }
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
        toast.error('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Blog not found'}</h1>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>

        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {blog.image && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex justify-end mb-4">
              <time className="text-sm text-gray-500" dateTime={blog.createdAt}>
                {formatDate(blog.createdAt)}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center mb-8">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {authorName}
                </p>
                <div className="flex space-x-2 text-sm text-gray-500">
                  <span>{Math.ceil(blog.content?.length / 200) || 2} min read</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              {blog.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
