import { useContext, useState, useEffect, useCallback } from 'react';
import CustomTextarea from "../../forms/custom_textarea";
import CustomInput from "../../forms/custom_input";
import { DocumentsAditionals } from "../../commons/documents";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_uno = ({ pasoData, id, stepNumber, marcojuridico }) =>
{
  const { handleUpdatePaso, handleUploadFiles } = useContext(FormularioContext);
  const [ formData, setFormData ] = useState({
    marcojuridico: pasoData.marcojuridico || [],
    paso1: pasoData.paso1 || {
      forma_juridica_organismo: '',
      mision_institucional: '',
      descripcion_archivo_marco_juridico: '',
      informacion_adicional_marco_juridico: '',
    }
  });
  const [ inputStatus, setInputStatus ] = useState({
    forma_juridica_organismo: { loading: false, saved: false },
    mision_institucional: { loading: false, saved: false },
    descripcion_archivo_marco_juridico: { loading: false, saved: false },
    informacion_adicional_marco_juridico: { loading: false, saved: false },
  });
  const [ isUploading, setIsUploading ] = useState(false);

  useEffect(() =>
  {
    const savedData = localStorage.getItem('formData');
    if (savedData)
    {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() =>
  {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [ formData ]);


  const handleChange = (inputName, e) =>
  {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      paso1: {
        ...prevFormData.paso1,
        [ inputName ]: value,
      }
    }));
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { loading: false, saved: false }
    }));
  };

  const handleSave = async (inputName) =>
  {
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { ...prevStatus[ inputName ], loading: true }
    }));

    try
    {
      const success = await handleUpdatePaso(id, stepNumber, formData);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: success }
      }));
    } catch (error)
    {
      console.error('Error al guardar:', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: false }
      }));
    }
  };



  const uploadFiles = useCallback(async (inputFiles) =>
  {
    // Comprobar si inputFiles es un archivo o un array de archivos
    const filesArray = Array.isArray(inputFiles) ? inputFiles : [ inputFiles ];

    setIsUploading(true);

    const formData = new FormData();

    // Iterar sobre todos los archivos (o el único archivo) y añadirlos a formData
    filesArray.forEach(file =>
    {
      if (file)
      {
        formData.append('marcojuridico', file);
      }
    });

    try
    {
      // Suponiendo que handleUploadFiles puede manejar múltiples archivos y espera FormData como argumento
      const success = await handleUploadFiles(id, stepNumber, formData, 'marcojuridico');
      if (success)
      {
        console.log('Todos los archivos fueron cargados con éxito');
      } else
      {
        console.log('La operación de carga no tuvo éxito.');
      }
    } catch (error)
    {
      console.error('Error en la carga de archivos:', error);
    } finally
    {
      setIsUploading(false);
    }
  }, [ id, stepNumber, handleUploadFiles ]);


  const handleFileChange = useCallback((inputFiles) =>
  {
    setIsUploading(true);

    // Asegurarse de que inputFiles sea siempre un array
    const filesArray = Array.isArray(inputFiles) ? inputFiles : [ inputFiles ]
      ;
    // Preparar FormData con todos los archivos para 'marcojuridico'
    const formData = new FormData();
    filesArray.forEach(file =>
    {
      formData.append('marcojuridico', file);
    });

    // Aquí asumimos que `handleUploadFiles` puede manejar este FormData
    // y que está configurado para enviar la solicitud al backend correctamente
    handleUploadFiles(id, stepNumber, formData, 'marcojuridico')
      .then(() =>
      {
        console.log('Todos los archivos fueron cargados con éxito');
        setIsUploading(false);
      })
      .catch(error =>
      {
        console.error('Error en la subida de archivos:', error);
        setIsUploading(false);
      });
  }, [ id, stepNumber, handleUploadFiles ]);
  



  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <span className="my-4 text-sans-h4">1.1 Ficha de descripción organizacional</span>
        <div className="my-4 ">
          <CustomInput
            label="Denominación del organismo"
            placeholder="Escriba la denominación del organismo"
            id={pasoData?.denominacion_organismo}
            value={pasoData?.denominacion_organismo}
            disabled={true}
            readOnly={false}
            name="denominacion_organismo"
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Forma jurídica del organismo (Obligatorio)"
            placeholder="Debes llenar este campo para poder enviar el formulario."
            name="forma_juridica_organismo"
            value={pasoData?.forma_juridica_organismo}
            onChange={(e) => handleChange('forma_juridica_organismo', e)}
            onBlur={() => handleSave('forma_juridica_organismo')}
            loading={inputStatus.forma_juridica_organismo.loading}
            saved={inputStatus.forma_juridica_organismo.saved}
            maxLength={500}
            readOnly={false}
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
            onFilesChanged={handleFileChange}
            onUpload={uploadFiles}
            marcoJuridicoData={marcojuridico}
          />
          {isUploading && (
            <div className="loading-indicator col-11 w-50 mx-auto">
              <div className="text-center">
                Cargando archivos...
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
            value={pasoData?.descripcion_archivo_marco_juridico}
            onChange={(e) => handleChange('descripcion_archivo_marco_juridico', e)}
            onBlur={() => handleSave('descripcion_archivo_marco_juridico')}
            loading={inputStatus.descripcion_archivo_marco_juridico.loading}
            saved={inputStatus.descripcion_archivo_marco_juridico.saved}
            maxLength={500}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Misión Institucional (Obligatorio)"
            placeholder="Misión que defina el propósito de ser del organismo"
            name="mision_institucional"
            value={pasoData?.mision_institucional}
            onChange={(e) => handleChange('mision_institucional', e)}
            onBlur={() => handleSave('mision_institucional')}
            loading={inputStatus.mision_institucional.loading}
            saved={inputStatus.mision_institucional.saved}
            maxLength={500}
          />
        </div>
        <div className="my-4">
          <CustomTextarea
            label="Información adicional (Opcional)"
            placeholder="Escribe información adicional de ser necesario"
            name="informacion_adicional_marco_juridico"
            value={pasoData?.informacion_adicional_marco_juridico}
            onChange={(e) => handleChange('informacion_adicional_marco_juridico', e)}
            onBlur={() => handleSave('informacion_adicional_marco_juridico')}
            loading={inputStatus.informacion_adicional_marco_juridico.loading}
            saved={inputStatus.informacion_adicional_marco_juridico.saved}
            maxLength={500}
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