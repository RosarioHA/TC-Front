import { useState, useEffect } from "react";
import { BtnOrganigrama } from "../commons/btnOrganigrama";

export const SubirOrganigrama = ({ index,tituloDocumento , readOnly, archivoDescargaUrl, handleFileSelect, fieldName }) =>
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
      let maxLength = 25; // Por defecto, si la pantalla es mayor a 1400px
      if (screenWidth < 1400) {
        maxLength = 15; // Si la pantalla es menor a 1400px
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
      const file = event.target.files[0];
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
    
        let name = file.name;
      
        // Definir la longitud máxima de acuerdo al ancho de la pantalla
        let maxLength = 25; // Por defecto, si la pantalla es mayor a 1400px
        const screenWidth = window.innerWidth;
        if (screenWidth < 1400) {
          maxLength = 15; // Si la pantalla es menor a 1400px
        }
      
        // Truncar el nombre si es más largo que la longitud máxima
        if (name.length > maxLength) {
          name = name.substring(0, maxLength) + '...';
        }
    
        setError('');
        setFileName(name);
        setFileUploaded(true);
        handleFileSelect(file, fieldName);
      }
    };

  const handleDelete = () =>
  {
    setFileUploaded(false);
    setFileName('');
    setError('');
    handleFileSelect('', fieldName);
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
      <div className="d-flex justify-content-between align-items-center gap-2 neutral-line align-items-center">
        <div className="p-3 ps-3 me-0">{index}</div>
        
          <div className="py-3 text-wrap col-5">{fileName}</div>
  
        <div className="py-3 px-2">{error ? <div className="text-sans-p-bold-darkred">{error}</div> : displayFileType}</div>
        <div>
          {!readOnly ? (
            <div className="col p-3 d-flex">
              <BtnOrganigrama onFileChange={handleFileChange} fileUploaded={fileUploaded} />
              {fileUploaded && (
                <>
                  <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                    <span className="text-sans-b-red">Borrar</span>
                    <i className="material-symbols-rounded">delete</i>
                  </button>
                </>
              )}

            </div>
          ) : archivoDescargaUrl && (
            <button onClick={handleDownload} className="btn-secundario-s px-2 d-flex align-items-center">
              <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
              <i className="material-symbols-rounded ms-2">download</i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

