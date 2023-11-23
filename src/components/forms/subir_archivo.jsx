import { useState } from "react";
import UploadBtn from "../commons/uploadBtn";

const SubirArchivo = ({ index, fileType }) => {
  const [ fileUploaded, setFileUploaded ] = useState(false);
  const [ fileName, setFileName ] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[ 0 ];
    if (file)
    {
      setFileUploaded(true);
      setFileName(file.name);
    }
  };
  const handleDelete = () => {
    setFileUploaded(false);
    setFileName('');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="p-3 ms-2">{index}</div>
          <div className="p-3 ms-4">{fileUploaded ? fileName : fileType}</div>
        </div>
        <div>
          <div className="col p-3 d-flex">
          <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
          {fileUploaded && <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1"><span className="text-sans-b-red ">Borrar</span><i className="material-symbols-rounded ">delete</i></button>}
        </div>
        </div>
      </div>
    </>
  );
}

export default SubirArchivo;
