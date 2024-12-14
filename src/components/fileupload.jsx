import React, { useState } from 'react';
import axios from 'axios';
const api = 'http://localhost:5000';

function Fileupload() {
    const [selectFile, setSelectFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

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
        console.log('file uploaded successfully');
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectFile(file);
        Filetobackend(file);
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'sentiment_analysis.png';
        link.click();
    };

    return (
        <div style={{
            height: '100vh', /* Make the page full viewport height */
            overflow: 'hidden', /* Disable page scrolling */
            display: 'flex', /* Flexbox to center content */
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
                <h1>Student Feedback Analyzer</h1>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <form>
                    <p>Upload your Feedbacks .CSV File</p>
                    <input type="file" onChange={handleFileChange}  style={{marginLeft:'85px'}}/>
                </form>
            </div>

            {imageUrl && (
                <div style={{
                    marginTop: '20px',
                    width: '80%', /* Limit width of the scrollable area */
                    maxHeight: '60vh', /* Limit height so it stays within the screen */
                    overflow: 'auto', /* Enable scrolling in this container */
                    border: '1px solid #ccc', /* Optional styling */
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
