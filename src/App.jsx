import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS file for styling

const BASE_URL = 'https://fastapi-dicom-2.onrender.com';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastUploadedFilename, setLastUploadedFilename] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [fileExists, setFileExists] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const navigate = useNavigate();

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setLastUploadedFilename(file.name); // Show the file name
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log('Uploading file:', selectedFile.name);
      const response = await fetch(`${BASE_URL}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to upload file: ${response.status} - ${errorMessage}`);
      }

      const result = await response.json();
      setLastUploadedFilename(result.filename);
      setResponseMessage(JSON.stringify(result, null, 2));
      setFileExists(false);
      console.log('Image uploaded successfully:', result.filename);
    } catch (error) {
      console.error('Upload Error:', error);
      if (error.message.includes('already exists')) {
        setFileExists(true);
      } else {
        setResponseMessage(`Error: ${error.message}`);
      }
    }
  };

  const getMetadata = async () => {
    if (!lastUploadedFilename && !selectedFile) {
      alert('No file selected yet.');
      return;
    }

    try {
      console.log('Fetching metadata for:', lastUploadedFilename || selectedFile.name);
      const encodedFilename = encodeURIComponent(lastUploadedFilename || selectedFile.name);
      const response = await fetch(`${BASE_URL}/metadata/${encodedFilename}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status} - ${await response.text()}`);
      }

      const result = await response.json();
      setMetadata(result);
      navigate('/card', { state: { metadata: result } });
    } catch (error) {
      console.error('Metadata Fetch Error:', error);
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Image Upload and Metadata</h1>
      <div className="upload-section">
        <input type="file" id="fileInput" accept="image/*" hidden onChange={handleFileSelection} />
        <button onClick={() => document.getElementById('fileInput').click()} className="button-click">
          Choose File
        </button>
        <button onClick={uploadFile} className="button-click">Upload Image</button>
      </div>
      
      {selectedFile && (
        <p>
          Selected File: <a href="#" className="file-link">{selectedFile.name}</a>
        </p>
      )}

      {fileExists && <p className="file-exists-message">File already exists in the database.</p>}

      <div className="metadata-section">
        <button onClick={getMetadata} className="button-click">Get Metadata</button>
      </div>

      <div className="response-section">
        <pre>{responseMessage}</pre>
      </div>

    </div>
  );
};

export default App;
