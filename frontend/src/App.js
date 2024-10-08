import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import Modal
import { Viewer, Worker } from '@react-pdf-viewer/core';
import './App.css'; // Import the CSS file for styling

Modal.setAppElement('#root'); // Set app element for accessibility

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // For modal state
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null); // For selected PDF

  // Handle file selection
  const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      setFile(null);
      return;
    }

    setFile(file); // Allow file if it's a PDF
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const fileContent = reader.result.split(",")[1]; // Base64 string

      const payload = {
        fileName: file.name,
        fileContent,
      };

      try {
        const response = await axios.post(
          `${API_URL}/upload`, // Use dynamic API URL
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        setMessage(response.data.message);
        fetchFileInfos(); // Fetch updated file infos after upload
      } catch (error) {
        console.error("Error uploading file", error);
        setMessage("File upload failed");
      }
    };
    reader.readAsDataURL(file); // Convert file to base64
  };

  // Fetch file info from the backend
  const fetchFileInfos = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`); // Use dynamic API URL
      setFileInfos(response.data);
    } catch (error) {
      console.error("Error fetching file info", error);
    }
  };

  // Open modal and set selected PDF URL
  const openModalWithPdf = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPdfUrl(null);
  };

  useEffect(() => {
    fetchFileInfos(); // Fetch file info on component load
  }, []);

  return (
    <div className="App">
      <h1 className="app-title">PDF Upload System</h1>

      <div className="upload-section">
        <input type="file" onChange={onFileChange} className="file-input" />
        <button onClick={onFileUpload} className="upload-button">Upload PDF</button>
        <p className="message">{message}</p>
      </div>

      <h1 className="table-title">Uploaded Files</h1>

      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileInfos.map((info) => (
            <tr key={info.id}>
              <td>{info.fileName}</td>
              <td>{new Date(info.uploadDate).toLocaleString()}</td>
              <td>
                <button onClick={() => openModalWithPdf(info.viewUrl)} className="view-button">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PDF Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="View PDF"
        className="pdf-modal"
        overlayClassName="pdf-overlay"
      >
        <button onClick={closeModal} className="close-button">Close</button>
        {selectedPdfUrl && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="pdf-viewer">
              <Viewer fileUrl={selectedPdfUrl} />
            </div>
          </Worker>
        )}
      </Modal>
    </div>
  );
};

export default App;
