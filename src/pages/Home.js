import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to WritEra</h1>
      <p className="home-description">This is a simple blog site where you can create and view blogs. Share your thoughts, ideas, and stories with the world.</p>
      
      <div className="home-links">
        <Link to="/create" className="home-link btn">Create a New Blog</Link>
        <Link to="/blogs" className="home-link btn">View All Blogs</Link>
      </div>
    </div>
  );
};

export default Home;