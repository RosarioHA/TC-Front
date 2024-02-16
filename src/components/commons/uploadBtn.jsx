import { useRef } from 'react';

const UploadBtn = ({ onFileChange, fileUploaded, onViewFile, ver }) => {
  const inputFile = useRef(null);
  const handleButtonClick = () => { inputFile.current.click(); };

  return (
    <>
      <input type="file" className="d-none" onChange={onFileChange} ref={inputFile} />
      {fileUploaded ? (
        <>
          {ver ? (
            // Si `ver` es true, mostrar solo el botón "Ver"
            <button className="btn-secundario-s text-sans-p-blue d-flex px-3" type="button" onClick={onViewFile}>
              <i className="material-symbols-outlined  me-2"> visibility </i>
              <u>Ver</u>
            </button>
          ) : (
            // Si `ver` es false o no está presente, mostrar el botón "Modificar"
            <button className="btn-secundario-s text-sans-p-blue d-flex px-1" type="button" onClick={handleButtonClick}>
              <u>Modificar</u>
              <i className="material-symbols-outlined"> edit</i>
            </button>
          )}
        </>
      ) : (
        // Si no hay archivo subido, mostrar el botón para subir archivo
        <button className="btn-secundario-s d-flex mx-2" type="button" onClick={handleButtonClick}>
          <i className="material-symbols-outlined">upgrade</i>
          <u className="align-self-center text-sans-b-white">Subir Archivo</u>
        </button>
      )}
    </>
  );
}

export default UploadBtn;
