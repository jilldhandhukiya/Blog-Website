import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import 'quill/dist/quill.snow.css';
import './BlogEdit.css'; // Import the updated CSS file
import askItAllName from '../Assets/askitallnamee.svg';
import askItAllLogo from '../Assets/askitalllogo.svg';


const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
  ]
};

export default function BlogEdit(UserInfo) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    content: '',
    tag: '',
  });

  const [Uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml')) {
      setFormData(prevData => ({
        ...prevData,
        image: file // Store the file object directly in state
      }));
      setError('');
    } else {
      setError('Please upload a valid image file (jpeg, png, svg).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml')) {
      setFormData(prevData => ({
        ...prevData,
        image: file
      }));
      setError('');
    } else {
      setError('Please upload a valid image file (jpeg, png, svg).');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleContentChange = (newValue) => {
    setFormData(prevData => ({
      ...prevData,
      content: newValue
    }));
  };

  const handleRemoveImage = () => {
    setFormData(prevData => ({
      ...prevData,
      image: null
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTagChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      tag: e.target.value
    }));
  };

  const handlePreview = () => {
    const { title, subtitle, image, content, tag } = formData;
    if (!title || !subtitle || !image || !content || !tag) {
      setPreviewError('Please fill in all the fields to preview the blog post.');
    } else {
      setPreviewError('');
      setShowPreview(true);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const processContentForPreview = (htmlContent) => {
    // Replace image tags with fixed-size container
    const modifiedContent = htmlContent.replace(/<img/g, '<img style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;"');
    return modifiedContent;
  };

  const publishPost = async () => {
    const { title, subtitle, image, content, tag } = formData;

    const form = new FormData();
    form.append('title', title);
    form.append('subtitle', subtitle);
    form.append('image', image);
    form.append('content', content);
    form.append('tag', tag);
    form.append('UserInfo', JSON.stringify(UserInfo.UserInfo.data.id))

    try {
      const response = await fetch('http://localhost:5000/api/blog/posts', {
        method: 'POST',
        body: form,
       // headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      setUploaded(true)

    } catch (error) {
      console.error('Error publishing post:', error.message);
    }
  };

  const { title, subtitle, image, content, tag } = formData;

  if (Uploaded) return <Navigate to={'/'} />

  return (
    <div className="blog-edit-container">
      <header className="blog-edit-header">
        <img src={askItAllLogo} alt="Logo" className="askitall-logo" />
        <img src={askItAllName} alt="Name" className="askitall-name" />
      </header>

      {!showPreview ? (
        <>
          <form className="blog-edit-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Heading"
                name="title"
                value={title}
                maxLength={30}
                onChange={handleChange}
              />
              <p>{30 - title.length} characters remaining for the title</p>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Subheading"
                name="subtitle"
                value={subtitle}
                maxLength={50}
                onChange={handleChange}
              />
              <p>{50 - subtitle.length} characters remaining for the sub-title</p>
            </div>

            <div className="tag-container">
              <label className="tag-label">Tags: </label>
              <div className="radio-buttons">
                <label style={{ color: tag === 'Legal' ? '#ff4500' : 'initial' }}>
                  <input
                    type="radio"
                    value="Legal"
                    name="tag"
                    checked={tag === 'Legal'}
                    onChange={handleTagChange}
                  />
                  Legal
                </label>
                <label style={{ color: tag === 'Finance' ? '#ff4500' : 'initial' }}>
                  <input
                    type="radio"
                    value="Finance"
                    name="tag"
                    checked={tag === 'Finance'}
                    onChange={handleTagChange}
                  />
                  Finance
                </label>
              </div>
            </div>

            <div
              className="drop-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {image ? (
                <div className="thumbnail-container">
                  <img src={URL.createObjectURL(image)} alt="Thumbnail" className="thumbnail" />
                  <button type="button" className="remove-button" onClick={handleRemoveImage}>X</button>
                </div>
              ) : (
                <p>Drag an image here or <label htmlFor="file-upload" className="file-upload-label">upload a file</label> for the thumbnail of your BlogPost!!</p>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".jpeg, .png, .svg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            {error && <p className="error">{error}</p>}

            <ReactQuill
              value={content}
              onChange={handleContentChange}
              modules={modules}
              className="blog-editor"
            />
          </form>

          <div className="button-container">
            <button type="button" className="preview-button" onClick={handlePreview}>Preview</button>
            <button type="button" className="publish-button" onClick={publishPost}>Publish</button>
          </div>

          {previewError && <p className="error">{previewError}</p>}
        </>
      ) : (
        <div className="preview-modal">
          <div className="preview-content">
            {image && <img src={URL.createObjectURL(image)} alt="Thumbnail Preview" className="thumbnail-preview" />}
            <h2><strong>{title}</strong></h2>
            <h4>{subtitle}</h4>
            <p><strong>Tag:</strong> {tag}</p>
            <div dangerouslySetInnerHTML={{ __html: processContentForPreview(content) }} />
            <button className="close-button" onClick={handleClosePreview}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}