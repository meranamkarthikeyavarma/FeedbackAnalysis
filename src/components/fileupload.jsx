import React, { useState } from 'react';
import axios from 'axios';

const api = 'http://localhost:5000';

function Fileupload() {
    const [uploadedFiles, setUploadedFiles] = useState([]); // Store multiple files
    const [selectedFile, setSelectedFile] = useState(null); // Selected file for processing
    const [imageUrl, setImageUrl] = useState(null); // For displaying the result image

    // Function to send the selected file to the backend
    const Filetobackend = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${api}/feedbackfile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
        });

        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
        console.log('File processed successfully');
    };

    // Handle file uploads
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Get all selected files
        setUploadedFiles(prevFiles => [...prevFiles, ...files]); // Append new files to existing list
        if (files.length > 0) {
            setSelectedFile(files[0]); // Default selection to the first newly added file
        }
    };

    // Handle dropdown selection
    const handleDropdownChange = (event) => {
        const selectedFilename = event.target.value;
        const selected = uploadedFiles.find(file => file.name === selectedFilename);
        setSelectedFile(selected);
    };

    // Send the selected file to the backend for processing
    const processSelectedFile = () => {
        if (selectedFile) {
            Filetobackend(selectedFile);
        } else {
            alert('Please select a file to process.');
        }
    };

    // Download the resulting image
    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'sentiment_analysis.png';
        link.click();
    };

    return (
        <div style={{
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
                <h1>Student Feedback Analyzer</h1>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <form>
                    <p>Upload your Feedbacks .CSV Files</p>
                    <input type="file" multiple onChange={handleFileChange} style={{ marginLeft: '85px' }} />
                </form>
            </div>

            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="fileDropdown">Select a file:</label>
                    <select id="fileDropdown" onChange={handleDropdownChange} value={selectedFile?.name || ''}>
                        {uploadedFiles.map((file, index) => (
                            <option key={index} value={file.name}>{file.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button onClick={processSelectedFile}>Process Selected File</button>
            </div>

            {imageUrl && (
                <div style={{
                    marginTop: '20px',
                    width: '80%',
                    maxHeight: '60vh',
                    overflow: 'auto',
                    border: '1px solid #ccc',
                    padding: '10px'
                }}>
                    <img src={imageUrl} alt="Sentiment Analysis Result" style={{ width: '100%', height: 'auto' }} />
                </div>
            )}

            {imageUrl && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={downloadImage}>Download Dashboard</button>
                </div>
            )}
        </div>
    );
}

export default Fileupload;
