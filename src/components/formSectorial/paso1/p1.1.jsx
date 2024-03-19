import { useContext, useState, useEffect } from 'react';
import CustomTextarea from "../../forms/custom_textarea";
import CustomInput from "../../forms/custom_input";
import { DocumentsAditionals } from "../../commons/documents";
import { FormularioContext } from "../../../context/FormSectorial";
import {useUploadMarcoJuridico} from '../../../hooks/formulario/useMarcoJuridico';
import { apiTransferenciaCompentencia } from '../../../services/transferenciaCompetencia';

export const Subpaso_uno = ({ dataPaso, id, stepNumber, marcojuridico, solo_lectura }) => {
  const { handleUpdatePaso} = useContext(FormularioContext);
  const { uploadDocumento } = useUploadMarcoJuridico(id, stepNumber); 
  const initialValues = {
    marcojuridico: marcojuridico || [],
    paso1: {
      forma_juridica_organismo: dataPaso?.forma_juridica_organismo || '',
      mision_institucional: dataPaso?.mision_institucional || '',
      descripcion_archivo_marco_juridico: dataPaso?.descripcion_archivo_marco_juridico || '',
      informacion_adicional_marco_juridico: dataPaso?.informacion_adicional_marco_juridico || '',
    },
  };

  const [formData, setFormData] = useState(initialValues);
  const [inputStatus, setInputStatus] = useState({
    forma_juridica_organismo: { loading: false, saved: false },
    mision_institucional: { loading: false, saved: false },
    descripcion_archivo_marco_juridico: { loading: false, saved: false },
    informacion_adicional_marco_juridico: { loading: false, saved: false },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [marcoJuridicoFiles, setMarcoJuridicoFiles] = useState(marcojuridico || []);

  

  useEffect(() => {
    setMarcoJuridicoFiles(marcojuridico || []);
  }, [marcojuridico]);



const fetchData = async () => {
  try {
    const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
    setMarcoJuridicoFiles(response.data.marcojuridico);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (inputName, e) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      paso1: {
        ...prevFormData.paso1,
        [inputName]: value,
      },
    }));
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [inputName]: { loading: false, saved: false },
    }));
  };

  const handleSave = async (inputName) => {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [inputName]: { ...prevStatus[inputName], loading: true },
    }));

    try {
      const success = await handleUpdatePaso(id, stepNumber, formData);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: success },
      }));
    } catch (error) {
      console.error('Error saving:', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: false },
      }));
    }
  };
  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      await uploadDocumento(id, { documento: file });
      await fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const eliminarDocMarco = async (idMarco) =>
  {
    const payload = {
      marcojuridico: [ {
        id: idMarco,
        DELETE: true
      } ]
    };

    try
    {
      await handleUpdatePaso(id, stepNumber, payload);
      setMarcoJuridicoFiles(currentFiles => currentFiles.filter(file => file.id !== idMarco));
      await fetchData();
    } catch (error)
    {
      console.error("Error al eliminar el marco juridico:", error);
    }
  };

  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">1.1 Ficha de descripción organizacional</span>
        <div className="my-4 ">
          <CustomInput
            label="Denominación del organismo"
            placeholder="Escriba la denominación del organismo"
            id={dataPaso?.denominacion_organismo}
            value={dataPaso?.denominacion_organismo}
            disabled={true}
            readOnly={solo_lectura}
            name="denominacion_organismo"
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Forma jurídica del organismo (Obligatorio)"
            placeholder="Debes llenar este campo para poder enviar el formulario."
            name="forma_juridica_organismo"
            value={dataPaso?.forma_juridica_organismo}
            onChange={(e) => handleChange('forma_juridica_organismo', e)}
            onBlur={() => handleSave('forma_juridica_organismo')}
            loading={inputStatus.forma_juridica_organismo.loading}
            saved={inputStatus.forma_juridica_organismo.saved}
            maxLength={500}
            readOnly={solo_lectura}
          />
          <div className="d-flex mb-3 mt-0 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-0">Corresponde a su naturaleza jurídica: centralizado o descentralizado, concentrado o desconcentrado.</h6>
          </div>
        </div>
        <div className="container-fluid pb-3 col-12">
          <div className="mb-3 ">
            <span className="text-sans-h5">Marco jurídico que lo rige (Obligatorio)</span>
            <p className="text-sans-h6-grey">Mínimo 1 archivo, máximo 5 archivos, peso máximo 20MB, formato PDF)</p>
          </div>
          <DocumentsAditionals
            onFilesChanged={uploadFile}
            marcoJuridicoData={marcoJuridicoFiles}
            handleDelete={eliminarDocMarco}
            readOnly={solo_lectura}
          />
          {isUploading && (
            <div className="loading-indicator col-11 w-50 mx-auto">
              <div className="text-center">
                Guardando archivo...
              </div>
              <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Descripción archivo(s) de marco jurídico (Opcional)"
            placeholder="Descripción del marco jurídico"
            name="descripcion_archivo_marco_juridico"
            value={dataPaso?.descripcion_archivo_marco_juridico}
            onChange={(e) => handleChange('descripcion_archivo_marco_juridico', e)}
            onBlur={() => handleSave('descripcion_archivo_marco_juridico')}
            loading={inputStatus.descripcion_archivo_marco_juridico.loading}
            saved={inputStatus.descripcion_archivo_marco_juridico.saved}
            maxLength={500}
            readOnly={solo_lectura}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Misión Institucional (Obligatorio)"
            placeholder="Misión que defina el propósito de ser del organismo"
            name="mision_institucional"
            value={dataPaso?.mision_institucional}
            onChange={(e) => handleChange('mision_institucional', e)}
            onBlur={() => handleSave('mision_institucional')}
            loading={inputStatus.mision_institucional.loading}
            saved={inputStatus.mision_institucional.saved}
            maxLength={500}
            readOnly={solo_lectura}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Información adicional (Opcional)"
            placeholder="Escribe información adicional de ser necesario"
            name="informacion_adicional_marco_juridico"
            value={dataPaso?.informacion_adicional_marco_juridico}
            onChange={(e) => handleChange('informacion_adicional_marco_juridico', e)}
            onBlur={() => handleSave('informacion_adicional_marco_juridico')}
            loading={inputStatus.informacion_adicional_marco_juridico.loading}
            saved={inputStatus.informacion_adicional_marco_juridico.saved}
            maxLength={500}
            readOnly={solo_lectura}
          />
          <div className="d-flex mb-3 mt-1 text-sans-h6-primary col-11">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="mt-1">Llenar en caso de existir información que no sea posible clasificar en alguna de las categorías anteriores y que responda a particularidades propias del organismos.</h6>
          </div>
        </div>
      </div>
    </>
  );
};