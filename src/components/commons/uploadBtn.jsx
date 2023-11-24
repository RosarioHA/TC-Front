import { useRef } from 'react';

const UploadBtn = ({ onFileChange, fileUploaded }) => {
  const inputFile = useRef(null);
  const handleButtonClick = () => { inputFile.current.click();};

  return (
    <>
      <input type="file" className="d-none" onChange={onFileChange} ref={inputFile} />
      {fileUploaded ? (
        <button className="btn-secundario-s text-sans-p-blue d-flex px-1" type="button" onClick={handleButtonClick}>
          <u>Modificar</u>
          <i className="material-symbols-outlined"> edit</i>
        </button>
      ) : (
        <button className="btn-secundario-s d-flex" type="button" onClick={handleButtonClick}>
          <i className="material-symbols-outlined ">
            upgrade
          </i><u className="align-self-center text-sans-b-white ">Subir Archivo</u>
        </button>
      )}
    </>
  );
}

export default UploadBtn;