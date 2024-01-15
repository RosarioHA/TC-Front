import { useState } from "react";
import UploadBtn from "../commons/uploadBtn";

const SubirArchivo = ({ index, fileType, tituloDocumento, readOnly, archivoDescargaUrl, handleFileSelect }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFileUploaded(true);
      setFileName(event.target.files[0].name);

      handleFileSelect(event, tituloDocumento);
    }
  };

  
  const handleDelete = () => {
    setFileUploaded(false);
    setFileName('');
    handleFileSelect(null, tituloDocumento);
  };

  const handleDownload = () => {
    // Lógica para descargar archivo
    window.open(archivoDescargaUrl, '_blank');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="p-3 ms-2">{index}</div>
          {tituloDocumento && <div className="p-3 ms-2">{tituloDocumento}</div>}
          <div className="p-3 ms-4">{fileUploaded ? fileName : fileType}</div>
        </div>
        <div>
          <div className="col p-3 d-flex">
            {!readOnly ? (
              <>
                <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
                {!readOnly && fileUploaded && (
                  <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                    <span className="text-sans-b-red">Borrar</span>
                    <i className="material-symbols-rounded">delete</i>
                  </button>
                )}
              </>
            ) : (
              archivoDescargaUrl && (
                <button onClick={handleDownload} className="btn-secundario-s px-2 d-flex align-items-center mx-1">
                  <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
                  <i className="material-symbols-rounded ms-2">download</i>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SubirArchivo;
