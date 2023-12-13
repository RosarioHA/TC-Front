import { useState } from 'react';
import { AdditionalDocs } from "../commons/aditionalDocs";

export const DocumentsAditionals = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (files.length + newFiles.length <= 5) {
      setFiles(prevFiles => [...prevFiles, ...newFiles.map(file => ({ file, title: file.name }))]);
    } else {
      alert("No puedes agregar más de 5 archivos.");
    }
  };

  const handleDelete = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  return (
    <>
      <span className='text-sans-h3 mt-4'>Marco jurídico que lo rige (Obligatorio)</span>
      <p>Mínimo 1 archivo, máximo 5 archivos, peso máximo 20MB, formato PDF</p>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
        id="fileInput"
        style={{ display: "none" }} 
      />
      <button className="btn-secundario-s d-flex" onClick={() => document.getElementById('fileInput').click()}>
        <i className="material-symbols-outlined">upgrade</i>
        <u className="align-self-center text-sans-b-white">Subir Archivo</u>
      </button>
      {files.length > 0 && <AdditionalDocs
        key={Date.now()}
        files={files}
        onDelete={handleDelete}
      />}
    </>
  )
}