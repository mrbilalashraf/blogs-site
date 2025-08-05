import React, { useState, useRef, useMemo } from 'react'; // Add useRef
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useHistory } from 'react-router-dom';
import '../styles/CreateBlog.css';
import LZString from 'lz-string';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const history = useHistory();
  const quillRef = useRef(); // Ref for accessing Quill instance

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > MAX_IMAGE_SIZE) {
        alert('Image size must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);
        quill?.insertEmbed(range?.index || 0, 'image', reader.result);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please provide both title and content for your blog');
      return;
    }

    const newBlog = {
      id: Date.now().toString(),
      title: title,
      content: LZString.compress(content),
      createdAt: new Date().toISOString()
    };

    const existingBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    existingBlogs.push(newBlog);
    localStorage.setItem('blogs', JSON.stringify(existingBlogs));

    alert('Blog created successfully!');
    history.push('/blogs');
  };

  return (
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
        <button type="submit" className="submit-btn btn">
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;