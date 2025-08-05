import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/BlogDetails.css';
import LZString from 'lz-string';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Load blogs from localStorage
    const storedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    
    // Find the specific blog by id
    const foundBlog = storedBlogs.find(blog => blog.id === id);
    
    if (foundBlog) {
      setBlog(foundBlog);
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
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
          <p className="blog-date">Posted on: {formatDate(blog.createdAt)}</p>
          
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: LZString.decompress(blog.content) }}
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