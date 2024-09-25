import React, { useState, useRef } from "react";
import "./Upload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files
      ? e.target.files[0]
      : e.dataTransfer.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Upload bem-sucedido:", data);
        })
        .catch((error) => {
          console.error("Erro no upload:", error);
        });
    } else {
      alert("Por favor, selecione ou arraste um arquivo primeiro");
    }
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
          class="dragging"
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
        <button type="submit">Enviar</button>
      </form>
      {file && (
        <p>
          Arquivo selecionado:
          <span style={{  color: "#45a049", fontStyle:"italic" }}> {file.name}</span>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
