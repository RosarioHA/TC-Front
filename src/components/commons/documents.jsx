import { useState } from 'react';
import { AdditionalDocs } from "../commons/aditionalDocs";

export const DocumentsAditionals = ({ handleUpdatePaso, id, stepNumber }) =>
{
  const [ files, setFiles ] = useState([]);
  const [ maxFilesReached, setMaxFilesReached ] = useState(false);
  const [ isUploading, setIsUploading ] = useState(false);
  const maxFileSize = 20 * 1024 * 1024; // 20 MB
  const maxFileCount = 5; // Límite máximo de archivos

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length > maxFileCount) {
        alert("Se ha superado el límite máximo de archivos permitidos.");
        setMaxFilesReached(true);
        return;
    }

    const validFiles = selectedFiles.filter(file => file.size <= maxFileSize);
    if (validFiles.length < selectedFiles.length) {
        alert("Algunos archivos son demasiado grandes y no se cargarán.");
    }

    setFiles(prev => [...prev, ...validFiles.map(file => ({
        documento: file, // Aquí pasas el objeto File directamente
        documento_url: null, // Si necesitas una URL, puedes crearla aquí
        title: file.name
    }))]);

    if (validFiles.length > 0) {
        await uploadFiles(validFiles);
    }
};

const uploadFiles = async (filesToUpload) => {
  setIsUploading(true);

  try {
      const archivos = {
          'marcojuridico': filesToUpload.map(fileObj => fileObj.documento)
      };

      const datosPaso = {}; // Aquí agregarías los demás datos del paso si son necesarios

      const success = await handleUpdatePaso(id, stepNumber, datosPaso, archivos);

      if (success) {
          console.log('Archivos subidos con éxito');
          setFiles([]);
      } else {
          console.error('Error al subir archivos');
      }
  } catch (error) {
      console.error('Error durante la subida de archivos:', error);
  }

  setIsUploading(false);
};


  const handleDelete = async (index) =>
  {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (updatedFiles.length === 0)
    {
      const formDataToSend = new FormData();
      formDataToSend.append('marcojuridico', JSON.stringify([]));
      await handleUpdatePaso(id, stepNumber, formDataToSend);
    }
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
        {isUploading && <div className="spinner-border text-primary my-4 mx-3" role="status"></div>}
      </button>

      {files.length > 0 && !isUploading && (
        <AdditionalDocs
          key={Date.now()}
          files={files}
          onDelete={handleDelete}
        />
      )}

      {maxFilesReached && (
        <h6 className="text-sans-h6-primary">Alcanzaste el número máximo de archivos permitidos.</h6>
      )}
    </>
  );
};