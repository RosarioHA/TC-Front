import { useState, useEffect } from "react";
import UploadBtn from "../commons/uploadBtn";

const SubirArchivo = ({ index,  readOnly,onViewFile, archivoDescargaUrl,tituloDocumento,
  handleFileSelect, handleDelete, ver }) =>
{
  const [ fileUploaded, setFileUploaded ] = useState(false);
  const [ fileName, setFileName ] = useState('');
  const [ error, setError ] = useState('');
  const maxSize = 20 * 1024 * 1024; // 20 MB
  const [ isUploading, setIsUploading ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

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

  const handleFileChange = async (event) =>
  {
    const file = event.target.files[ 0 ];
    if (file)
    {
      // Verificar que el archivo es un PDF
      if (!file.type.includes("pdf"))
      {
        setError("Solo se permiten archivos PDF.");
        setFileUploaded(false); // Asegura que no se marca como subido un archivo no permitido
        return;
      }
      if (file.size > maxSize)
      {
        setError("El archivo no debe superar los 20 MB.");
        return;
      }
      setError(''); // Limpia cualquier mensaje de error anterior
      setFileName(file.name);
      setFileUploaded(true);
      setIsUploading(true); // Indica que la carga ha comenzado
      try
      {
        await handleFileSelect(file); // Suponiendo que `handleFileSelect` maneja la carga
      } catch (error)
      {
        // Opcional: manejar errores específicos de la carga
        setError("Error al subir el archivo. Por favor, inténtalo de nuevo.");
      } finally
      {
        setIsUploading(false); // Indica que la carga ha terminado
      }
    }
  };

  // Al eliminar un archivo
  const handleDeleteDoc = async () =>
  {
    setIsDeleting(true); // Indicador de eliminación activo
    try
    {
      await handleDelete(); // Suponiendo que es una promesa
      setFileName('');
      setFileUploaded(false);
      setError('');
    } finally
    {
      setIsDeleting(false); // Indicador de eliminación inactivo
    }
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
        {fileName && (
          <div className="py-3 text-wrap col-4">{fileName}</div>
        )}
        <div className="py-3 px-2">
          {error ? (
            <div className="text-sans-p-bold-darkred ">{error}</div>
          ) : isUploading ? (
            <div className="text-center text-sans-h5-medium-blue">Cargando archivo...</div> // Mensaje de carga
          ) : isDeleting ? (
            <div>Eliminando archivo...</div> // Mensaje de eliminación
          ) : (
            displayFileType
          )}
        </div>
        <div>
          {!readOnly ? (
            <div className="col-1 p-3 d-flex">
              <UploadBtn
                onFileChange={handleFileChange}
                fileUploaded={fileUploaded}
                onViewFile={() => onViewFile()}
                ver={ver}
              />
              {fileUploaded && (
                <button onClick={handleDeleteDoc} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                  <span className="text-sans-b-red">Borrar</span>
                  <i className="material-symbols-rounded">delete</i>
                </button>
              )}
            </div>
          ) : archivoDescargaUrl && (
            <div className="d-flex flex-row">
              <UploadBtn
                onFileChange={handleFileChange}
                fileUploaded={fileUploaded}
                onViewFile={() => onViewFile()}
                ver={ver}
              />
              <button onClick={handleDownload} className="btn-secundario-s px-2 d-flex align-items-center ms-5 me-3">
                <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
                <i className="material-symbols-rounded ms-2">download</i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubirArchivo;