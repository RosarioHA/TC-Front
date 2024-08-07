import { useState, useEffect } from "react";
import UploadBtn from "../commons/uploadBtn";

export const SubirArchivoRegiones = ({ index, handleDelete,tituloDocumento, readOnly, archivoDescargaUrl, handleFileSelect, fieldName, region }) =>
{
  const [ fileUploaded, setFileUploaded ] = useState(false);
  const [ fileName, setFileName ] = useState('');
  const [ error, setError ] = useState('');

  useEffect(() => {
    if (typeof tituloDocumento === 'string') {
      const parts = tituloDocumento.split('/');
      let name = parts.pop() || tituloDocumento;
  
      const pdfIndex = name.indexOf('.pdf');
      if (pdfIndex !== -1) {
        name = name.substring(0, pdfIndex + 4);
      }
      name = decodeURIComponent(name);
  
      // Obtener el ancho de la pantalla
      const screenWidth = window.innerWidth;
  
      // Definir la longitud máxima de acuerdo al ancho de la pantalla
      let maxLength = 35; // Por defecto, si la pantalla es mayor a 1400px
      if (screenWidth < 1400) {
        maxLength = 25; // Si la pantalla es menor a 1400px
      }
  
      // Truncar el nombre si es más largo que la longitud máxima
      if (name.length > maxLength) {
        name = name.substring(0, maxLength) + '...';
      }
  
      setFileName(name);
      setFileUploaded(true);
    } else {
      setFileUploaded(false);
    }
  }, [tituloDocumento]);

  const displayFileType = fileUploaded ? "Archivo guardado" : "No seleccionado";

  const handleFileChange = (event) =>
  {
    const file = event.target.files[ 0 ];
    if (file)
    {
      if (file.type !== "application/pdf")
      {
        setError("Solo se permiten archivos PDF.");
        return;
      }

      if (file.size > 20971520)
      {
        setError("El archivo no debe superar los 20 MB.");
        return;
      }

      setError('')
      setFileUploaded(true);
      handleFileSelect(file, fieldName);
    }
  };

  const handleDeleteRegion = () =>
  {
    handleDelete()
    setFileUploaded(false);
    setFileName('');
    setError('');
  };

  const handleDownload = () =>
  {
    if (archivoDescargaUrl)
    {
      window.open(archivoDescargaUrl, '_blank');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between grid align-items-center neutral-line align-items-center">
        <dv className="col-sm-2 col-3 d-flex ">
        <div className="py-3 px-3 my-auto">{index}</div>
        <div className="py-2 col-3 col-sm-1 ms-1">{region}</div>
        </dv>
        <div className="py-3 col-4 col-sm-2">{fileName}</div>
        <div className="py-3 col-1 px-1 me-2">{error ? <div className="text-sans-p-bold-darkred">{error}</div> : displayFileType}</div>
        <div className="col-4">
          {!readOnly ? (
            <div className="p-3 d-flex me-2">
              <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
              {fileUploaded && (
                <>
                  <button onClick={handleDeleteRegion } className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                    <span className="text-sans-b-red">Borrar</span>
                    <i className="material-symbols-rounded">delete</i>
                  </button>
                </>
              )}
            </div>
          ) : archivoDescargaUrl && (
            <button onClick={handleDownload} className="btn-secundario-s px-2 me-3 d-flex align-items-center">
              <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
              <i className="material-symbols-rounded ms-2">download</i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
