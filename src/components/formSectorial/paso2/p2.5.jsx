import { useState, useContext } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import UploadBtn from "../../commons/uploadBtn";
import { useFlujograma } from "../../../hooks/formulario/useFlujograma";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_dosPuntoCinco = ({id, stepNumber, data}) => {
  
  const { uploadFlujogramaCompetencia } = useFlujograma();
  const { hadleUpdatePaso} = useContext(FormularioContext); 
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
  })
console.log(data)

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Solo se permiten archivos PDF.");
        return;
      }
  
      if (file.size > 20971520) { // 20 MB
        setError("El archivo no debe superar los 20 MB.");
        return;
      }
  
      setFileName(file.name);
      setError('');
  
      try {
        // Cambio aquí: usa directamente `file` en lugar de `selectedFile`
        await uploadFlujogramaCompetencia( id,stepNumber,  file);
        setFileUploaded(true);
        setError(''); // Limpiar errores previos
      } catch (err) {
        setError("Error al subir el archivo. Por favor, inténtalo de nuevo.");
        console.error(err);
      }
    }
  };

  const handleDelete = () => {
    setFileUploaded(false);
    setFileName('');
    setError('');
  };


  return (
    <div>
      <h4 className="text-sans-h4">2.5 Flujograma de ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-grey">Mínimo 1 archivo, máximo 5 archivos, peso máximo 5MB por archivo, formato PDF</h6>

      <div className="ps-3">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
          </div>
        </div>
        <div className="row neutral-line align-items-center col-11">
          <div className="d-flex justify-content-between align-items-center gap-2 neutral-line align-items-center">
            <div className="p-3 ps-3 me-0">{/* Aquí deberías definir la lógica para mostrar el índice si es necesario */}</div>
            {fileName && (
              <div className="py-3 text-wrap col-5">{fileName}</div>
            )}
            <div className="py-3 px-2">{error ? <div className="text-sans-p-bold-darkred">{error}</div> : (fileUploaded ? "Archivo guardado" : "No seleccionado")}</div>
            <div>
              <div className="col p-3 d-flex">
                {fileUploaded && (
                  <>
                    <button onClick={handleDelete} className="btn-terciario-ghost px-2 d-flex align-items-center mx-1">
                      <span className="text-sans-b-red">Borrar</span>
                      <i className="material-symbols-rounded">delete</i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <CustomTextarea 
          rows={15}
          label="Descripción cualitativa del ejercicio de la competencia en la región" 
          placeholder="Describe el ejercicio de la competencia " 
          id="descEjercicioCompetencia" 
          maxLength={2200}/>
      </div>
    </div>
  );
};