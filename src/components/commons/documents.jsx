import { useState, useEffect } from 'react';

export const DocumentsAditionals = ({ onFilesChanged, marcoJuridicoData, handleDelete }) => {
  const [files, setFiles] = useState([]);
  const maxFiles = 5; // Máximo número de archivos permitidos
  const maxSize = 20 * 1024 * 1024; // 20 MB
  const [maxFilesReached, setMaxFilesReached] = useState(false);

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
      // Si no hay archivos, asegúrate de resetear el estado local
      setFiles([]);
      setMaxFilesReached(false);
    }
  }, [marcoJuridicoData, maxFiles]);

  const handleFileChange = async (event) => {
    const incomingFiles = Array.from(event.target.files).filter(file => file.size <= maxSize);
    if (incomingFiles.length === 0) {
      console.log('No hay archivos válidos seleccionados.');
      return;
    }
  
    // Calcula cuántos archivos más se pueden subir
    const availableSlots = maxFiles - files.length;
  
    if (availableSlots <= 0) {
      console.log('Número máximo de archivos ya alcanzado.');
      setMaxFilesReached(true);
      return;
    }
  
    // Limita el número de archivos seleccionados al número de espacios disponibles
    const filesToUpload = incomingFiles.slice(0, availableSlots);
  
    for (const file of filesToUpload) {
      await onFilesChanged(file);
    }
  
    // Verifica si se ha alcanzado el límite después de la subida
    if ((files.length + filesToUpload.length) >= maxFiles) {
      setMaxFilesReached(true);
    }
  };
  const handleDeleteDoc = (index) => {
    const documentoId = files[index].id;
    handleDelete(documentoId);
    setFiles(currentFiles => {
      const updatedFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);
      const reachedMaxFiles = updatedFiles.length >= maxFiles;
      setMaxFilesReached(reachedMaxFiles);
      return updatedFiles;
    });
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
      {!maxFilesReached && (
        <button className="btn-secundario-s d-flex" onClick={() => document.getElementById('fileInput').click()}>
          <i className="material-symbols-outlined">upgrade</i>
          <u className="align-self-center text-sans-b-white">Subir Archivo</u>
        </button>
      )}
      {files.map((fileObj, index) => (
        <div key={index} className={`row border-top align-items-center me-5 pe-5 col-11 mt-2 ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
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
  );
};
