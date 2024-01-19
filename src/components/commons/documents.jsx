import { useState, useEffect } from 'react';
import { AdditionalDocs } from "../commons/aditionalDocs";

export const DocumentsAditionals = ({ onFilesChanged }) => {
  const [files, setFiles] = useState([]);
  const [maxFilesReached, setMaxFilesReached] = useState(false);

  const handleFileChange = (event) => {
    if (event.target && event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        title: file.name,
        isTooLarge: file.size > 20 * 1024 * 1024 // 20 MB
      }));

      const totalFiles = [...files, ...newFiles];
      if (totalFiles.length <= 5) {
        setFiles(totalFiles);
        setMaxFilesReached(false);
      } else {
        setMaxFilesReached(true);
      }
    }
  };

  useEffect(() => {
    onFilesChanged(files);
  }, [files, onFilesChanged]); 

  const handleDelete = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setMaxFilesReached(updatedFiles.length <= 5);
  };

  return (
    <>
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
      {files.length > 0 && (
        <AdditionalDocs
          key={Date.now()}
          files={files}
          onDelete={handleDelete}
        />
      )}
      {maxFilesReached && (
        <h6 className="text-sans-h6-primary">
          Alcanzaste el número máximo de archivos permitidos.
        </h6>
      )}
    </>
  );
};
