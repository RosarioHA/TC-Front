import { useState, useEffect } from 'react';

export const DocumentsAditionals = ({ onFilesChanged, marcoJuridicoData, handleDelete, handleDownload, readOnly }) => {
  const [files, setFiles] = useState([]);
  const maxFiles = 5; // Máximo número de archivos permitidos
  const maxSize = 20 * 1024 * 1024; // 20 MB
  const [maxFilesReached, setMaxFilesReached] = useState(false);
  const [fileTooLarge, setFileTooLarge] = useState(false); // Estado para manejar si el archivo es demasiado grande

  useEffect(() => {
    if (marcoJuridicoData && marcoJuridicoData.length > 0) {
      const updatedFiles = marcoJuridicoData.map(doc => {
        if (doc && doc.documento_url) {
          return {
            id: doc.id,
            title: doc.documento_url.split('/').pop(),
            isTooLarge: false,
          };
        }
        return null;
      }).filter(doc => doc !== null);

      setFiles(updatedFiles);
      setMaxFilesReached(updatedFiles.length >= maxFiles);
    } else {
      setFiles([]);
      setMaxFilesReached(false);
    }
  }, [marcoJuridicoData, maxFiles]);

  const handleFileChange = async (event) => {
    setFileTooLarge(false); // Reiniciar el estado de archivo demasiado grande
    const incomingFiles = Array.from(event.target.files);
    const filesExceedingMaxSize = incomingFiles.filter(file => file.size > maxSize);

    if (filesExceedingMaxSize.length > 0) {
      setFileTooLarge(true); // Establecer que hay archivos demasiado grandes
    }

    const validFiles = incomingFiles.filter(file => file.size <= maxSize);
    if (validFiles.length === 0) {
      return;
    }
  
    const availableSlots = maxFiles - files.length;
    if (availableSlots <= 0) {
      setMaxFilesReached(true);
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots);
    for (const file of filesToUpload) {
      await onFilesChanged(file);
    }

    if ((files.length + filesToUpload.length) >= maxFiles) {
      setMaxFilesReached(true);
    }
  };

  const handleDeleteDoc = (index) => {
    const documentoId = files[index].id;
    handleDelete(documentoId);
    setFiles(currentFiles => {
      const updatedFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);
      setMaxFilesReached(updatedFiles.length >= maxFiles);
      return updatedFiles;
    });
  };

  return (
    <>
    {readOnly ? (
      files.map((fileObj, index) => (
        <div key={index} className={`row align-items-center me-5 pe-5 col-11 mt-2 ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}>
          <div className="col-1 p-3">{index + 1}</div>
          <div className="col p-3">{fileObj.title}</div>
          <div className="col p-3"></div>
          <div className="col-2 p-3 d-flex">
            <button
              type="button"
              onClick={() => handleDownload(fileObj.id)}
              className="btn-secundario-s px-0 d-flex align-items-center mx-0"
            >
              <span className="text-sans-b-green mx-2">Descargar</span>
              <i className="material-symbols-rounded mx-2">download</i>
            </button>
          </div>
        </div>
      ))
    ) : (
    <>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
        id="fileInput"
        style={{ display: "none" }}
      />
      {!maxFilesReached && (
        <button className="btn-secundario-s d-flex" onClick={() => document.getElementById('fileInput').click()}>
          <i className="material-symbols-outlined">upgrade</i>
          <u className="align-self-center text-sans-b-white">Subir Archivo</u>
        </button>
      )}
      {fileTooLarge && (
        <h6 className="text-sans-p-bold-darkred my-2">
          El archivo no debe superar los 20 MB.
        </h6>
      )}
      {files.map((fileObj, index) => (
        <div key={index} className={`row align-items-center me-5 pe-5 col-11 mt-2 ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}>
          <div className="col-1 p-3">{index + 1}</div>
          <div className="col p-3">{fileObj.title}</div>
          <div className="col p-3"></div>
          <div className="col-2 p-3 d-flex">
            <button
              type="button"
              onClick={() => handleDeleteDoc(index)}
              className="btn-terciario-ghost px-0 d-flex align-items-center mx-0">
              <span className="text-sans-b-red mx-2">Borrar</span><i className="material-symbols-rounded">delete</i>
            </button>
          </div>
        </div>
      ))}
      {maxFilesReached && (
        <h6 className="text-sans-h6-primary">
          Alcanzaste el número máximo de archivos permitidos ({maxFiles} archivos).
        </h6>
      )}
    </>
    )}
  
    </>
  );
};
