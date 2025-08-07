import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ViewBlogs.css';
import LZString from 'lz-string';

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/getBlogs`);
        const data = await response.json();
        setBlogs(data.reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Function to create excerpt from HTML content
  const createExcerpt = (htmlContent) => {
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Return first 150 characters as excerpt
    return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
  };

  // Format date for display
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="view-blogs-container">
      {loading ? (
        <p className="loading-message">Loading all blogs...</p>
      ) : (
        <>
          <h1 className="view-blogs-title">All Blogs</h1>
          <div className="blog-list">
            {blogs.length > 0 ? (
              blogs.map(blog => (
                <div key={blog.id} className="blog-card">
                  {blog.cover_image && (
                    <div className="blog-cover-wrapper">
                      <img src={`${API_URL}/images/${blog.cover_image}`} alt="Cover" className="blog-cover-image" />
                    </div>
                  )}
                  <h2>{blog.title}</h2>
                  <p className="blog-date">Posted on: {formatDate(blog.created_at)}</p>
                  <p className="blog-excerpt">{createExcerpt(LZString.decompressFromBase64(blog.content))}</p>
                  <Link to={`/blog/${blog.id}`} state={{ blog }} className="read-more-link">
                    Read More
                  </Link>
                </div>
              ))
            ) : (
              <p className="placeholder-note">
                No blogs found. <Link to="/create" className="create-link">Create your first blog!</Link>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewBlogs;