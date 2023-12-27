import { useState, useEffect } from 'react';
import { AdditionalDocs } from "../commons/aditionalDocs";

export const DocumentsAditionals = ({ onFilesChanged }) =>
{
  const [ files, setFiles ] = useState([]);
  const [ maxFilesReached, setMaxFilesReached ] = useState(false);

  useEffect(() =>
  {
    onFilesChanged(files);
  }, [ files, onFilesChanged ]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const updatedFiles = newFiles.map(file => ({
      file,
      title: file.name,
      isTooLarge: file.size > 20 * 1024 * 1024 // 20 MB
    }));
  
    // Verificar si el número total de archivos excede el máximo permitido
    if (files.length + updatedFiles.length <= 5) {
      setFiles(prevFiles => [...prevFiles, ...updatedFiles]);
      setMaxFilesReached(false);
    } else {
      setMaxFilesReached(true);
    }
  };
  const handleDelete = (index) =>
  {
    const newFiles = [ ...files ];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    // Revisar si la cantidad de archivos es menor al máximo después de la eliminación
    if (newFiles.length <= 5)
    {
      setMaxFilesReached(false);
    }
  };

  return (
    <>
      <span className='text-sans-h5 mt-4'>Marco jurídico que lo rige (Obligatorio)</span>
      <p className="text-sans-h6-grey">Mínimo 1 archivo, máximo 5 archivos, peso máximo 20MB, formato PDF</p>
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
      {maxFilesReached && <h6 className="text-sans-h6-primary">Alcanzaste el número máximo de archivos permitidos.</h6>}
    </>
  );
};
