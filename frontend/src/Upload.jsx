import React, { useState, useRef } from "react";
import "./Upload.css";
import { ClipLoader } from "react-spinners";

const FileUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files
      ? e.target.files[0]
      : e.dataTransfer.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("Por favor, selecione ou arraste um arquivo primeiro");
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("payslip", file);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    try {
      const blob = await response.blob();

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/zip" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${file.name.replace("pdf", "zip")}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setIsProcessing(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("dragging");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("dragging");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e);
    dropRef.current.classList.remove("dragging");
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          className="dragging"
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <p>Arraste o arquivo ou clique para selecionar</p>
          <input
            name="payslip"
            type="file"
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: "none" }}
          />
        </div>
        { isProcessing ? <ClipLoader color="#71EA6C" /> : <button type="submit">Enviar</button> }
      </form>
      {file && (
        <p>
          Arquivo selecionado:
          <span style={{ color: "#45a049", fontStyle: "italic" }}>
            {" "}
            {file.name}
          </span>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
