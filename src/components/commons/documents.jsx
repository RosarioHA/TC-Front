import { useState, useEffect } from 'react';

export const DocumentsAditionals = ({ onFilesChanged, marcoJuridicoData }) =>
{
  const [ files, setFiles ] = useState([]);
  const maxFiles = 5; // Máximo número de archivos permitidos
  const maxSize = 20 * 1024 * 1024; // 20 MB
  const [ maxFilesReached, setMaxFilesReached ] = useState(false);

  useEffect(() =>
  {
    // Inicializa 'files' con la estructura correcta y el nombre del archivo obtenido de 'documento_url'
    const initialFiles = marcoJuridicoData.map(doc => ({
      title: doc.documento_url?.split('/').pop(),
      isTooLarge: false,
    })).filter((file, index, self) =>
      index === self.findIndex((t) => (t.title === file.title))
    );
    if (!marcoJuridicoData || !Array.isArray(marcoJuridicoData))
    {
      console.log('marcoJuridicoData no está disponible o no es un arreglo');
      return;
    }
    setFiles(initialFiles);
    setMaxFilesReached(initialFiles.length >= maxFiles);
  }, [ marcoJuridicoData ]);

  const handleFileChange = async (event) =>
  {
    const selectedFiles = Array.from(event.target.files).filter(file => file.size <= maxSize);

    if (selectedFiles.length === 0)
    {
      console.log('No hay archivos válidos seleccionados.');
      return;
    }

    // Verifica que los archivos seleccionados se pasen correctamente
    console.log('Archivos seleccionados:', selectedFiles);

    for (const file of selectedFiles)
    {
      if (files.length + 1 > maxFiles)
      {
        console.log('Número máximo de archivos alcanzado.');
        setMaxFilesReached(true);
        break;
      }

      // Verifica que cada archivo se pasa correctamente a la función onFilesChanged
      console.log('Subiendo archivo:', file);

      await onFilesChanged(file);
    }
  };

  const handleDelete = (index) =>
  {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setMaxFilesReached(updatedFiles.length >= maxFiles);

    // Verifica que los archivos eliminados se pasen correctamente a la función handleDelete
    console.log('Archivo eliminado:', files[ index ]);
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
      {files.length > 0 ? (
        <>
          <div className="row my-4 fw-bold border-top me-5 pe-5 col-11">
            <div className="col-1 mt-3">#</div>
            <div className="col mt-3">Documento</div>
            <div className="col mt-3"></div>
            <div className="col mt-3 ms-5">Acción</div>
          </div>
          {files.map((fileObj, index) => (
            <div key={index} className={`row border-top align-items-center me-5 pe-5 col-11 ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
              <div className="col-1 p-3">{index + 1}</div>
              <div className="col p-3">{fileObj.title}</div>
              <div className="col p-3"></div>
              <div className="col p-3 d-flex">
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="btn-terciario-ghost px-0 d-flex align-items-center mx-0">
                  <span className="text-sans-b-red mx-2">Borrar</span><i className="material-symbols-rounded">delete</i>
                </button>
              </div>
            </div>
          ))}
        </>
      ) : null}
      {maxFilesReached && (
        <h6 className="text-sans-h6-primary">
          Alcanzaste el número máximo de archivos permitidos ({maxFiles} archivos).
        </h6>
      )}
      {files.some(file => file.isTooLarge) && (
        <h6 className="text-sans-h6-primary">
          Algunos archivos no se añadieron porque exceden el tamaño máximo permitido (20MB).
        </h6>
      )}
    </>
  );
};
