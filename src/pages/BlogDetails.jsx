import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import '../styles/BlogDetails.css';
import LZString from 'lz-string';

const BlogDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (blog && blog.id?.toString() === id) {
      setLoading(false); // Already have the correct blog from props
      return;
    }

    // Fallback to fetch blog from DB
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/getBlogs/${id}`);
        if (!res.ok) throw new Error('Blog not found');

        const data = await res.json();
        setBlog(data[0]);
      } catch (error) {
        console.error('Fetch error:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Format date for display
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-details-container">
      {loading ? (
        <p>Loading blog...</p>
      ) : notFound ? (
        <div className="not-found">
          <h2>Blog Not Found</h2>
          <p>The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="back-link">
            Back to All Blogs
          </Link>
        </div>
      ) : (
        <>
          <h1>{blog.title}</h1>
          <p className="blog-date">Posted on: {formatDate(blog.created_at)}</p>
          {blog.cover_image && (
            <div className="blog-cover-image">
              <img src={`${API_URL}/images/${blog.cover_image}`} alt="Cover" />
            </div>
          )}

          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: LZString.decompressFromBase64(blog.content) }}
          />
          
          <div className="blog-actions">
            <Link to="/blogs" className="back-link">
              Back to All Blogs
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogDetails;