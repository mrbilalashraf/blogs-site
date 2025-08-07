import React, { useState, useRef, useMemo } from 'react'; // Add useRef
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useHistory } from 'react-router-dom';
import '../styles/CreateBlog.css';
import LZString from 'lz-string';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const quillRef = useRef();

  const API_URL = process.env.REACT_APP_API_URL;
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (file.size > MAX_IMAGE_SIZE) {
      alert('Cover image must be less than 1MB');
      e.target.value = '';
      setCoverImage('');
      return;
    }
  };
  
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > MAX_IMAGE_SIZE) {
        alert('Image size must be less than 1MB');
        return;
      }

      if (file) {
        const formData = new FormData();
        formData.append('contentImage', file);
  
        try {
          const res = await fetch(`${API_URL}/uploadContentImage`, {
            method: 'POST',
            body: formData
          });
  
          const data = await res.json();
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', data.url);
        } catch (err) {
          console.error('Image upload failed', err);
        }
      }
    };
  };

  // Updated modules with custom image handler
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);


  const formats = [
    'header', 'font',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
    'indent'
  ];

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (value) => setContent(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please provide both title and content for your blog');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
    formData.append('title', title);
    formData.append('content', LZString.compressToBase64(content));
    if (formData.get('content').length > 1000000) { // ~1MB base64 compressed
      alert('Your blog is too large. Please reduce content or image count.');
      return;
    }
    formData.append('createdAt', new Date().toISOString());

    const imageInput = document.getElementById('coverImage');
    const file = imageInput.files[0];
    if (file) {
      formData.append('coverImage', file);
    }

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      const data = await response.json();
      console.log(data);
      alert('Blog created successfully!');
      history.push('/blogs');
      
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <div className="loader-overlay">
        <div className="loader">Creating blog...</div>
      </div>
    ) : (

    <div className="create-blog-container">
      <h1 className="create-blog-title">Create a New Blog</h1>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coverImage">Cover Image</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={(e) => handleCoverImageChange(e)}
          />
        </div>

        <div className="form-group quill-container">
          <label htmlFor="content">Content</label>
          <ReactQuill
            ref={quillRef}
            value={content || ''}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="Write your awesome blog here..."
            className="react-quill"
          />
        </div>
        <button type="submit" className="submit-btn btn" disabled={isLoading}>
          Create Blog
        </button>
      </form>
    </div>
    )
  );
};

export default CreateBlog;