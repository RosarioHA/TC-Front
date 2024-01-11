import { useContext, useState, useEffect } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import SubirArchivo from "../../forms/subir_archivo";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_dos = ({ pasoData, organigrama ,id, stepNumber}) =>
{

  const {
    updatePasoError,
    handleUpdatePaso
  } = useContext(FormularioContext);
  const [ descripcionOrganigramaNacional, setDescripcionOrganigramaNacional ] = useState('');
  const [ formData, setFormData ] = useState({
    paso1: pasoData.paso1 || {
      descripcion_archivo_organigrama_regional: pasoData.descripcion_archivo_organigrama_regional,

    }
  });
  const [ inputStatus, setInputStatus ] = useState({
    descripcion_archivo_organigrama_regional: { loading: false, saved: false },
    // Agrega aquí los demás campos necesarios
  });

  useEffect(() =>
  {
    if (pasoData && pasoData.paso1)
    {
      setFormData({ paso1: pasoData.paso1 });
    }
  }, [ pasoData ]);

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

    const success = await handleUpdatePaso(id, stepNumber, formData);
    if (success)
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: true }
      }));
    } else
    {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: false }
      }));
    }
  };


  const handleDescripcionChange = (event) =>
  {
    setDescripcionOrganigramaNacional(event.target.value);
  };





  if (updatePasoError)
  {
    return <div>Error: {updatePasoError.message}</div>;
  }

  return (
    <div className="pe-5 me-5 mt-4 col-12">
      <h4 className="text-sans-h4">1.2 Organización Institucional</h4>
      <div className="text-sans-h6-primary mb-4 col-11">
        <h6>
          En esta sección se debe representar gráficamente la estructura orgánica
          de la institución a nivel nacional y regional, incluyendo el numero de funcionarios en las unidades intervinientes
          (departamento, division u otro) involucradas en el ejercicio de la competencia.
        </h6>
      </div>

      <h5 className="text-sans-h5">Organigrama Nacional (Obligatorio)</h5>
      <h6 className="text-sans-h6">Máximo 1 archivo, peso máximo 20MB, formato PDF</h6>

      <div className="col-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
        <div className="row neutral-line align-items-center">
          <SubirArchivo
            index="1"
            //fileType={''? "Seleccionado" : "No seleccionado"}
            onFileUpload=""
          />
        </div>
      </div>

      <div className="mt-4 col-12">
        <CustomTextarea
          label="Descripción del archivo adjunto (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descripcion_archivo_organigrama_regional"
          name="descripcion_archivo_organigrama_regional"
          value={descripcionOrganigramaNacional}
          onChange={handleDescripcionChange}
          onBlur=""
          maxLength={500}
        />
      </div>

      <h5 className="text-sans-h5 mt-4">Organigrama Regional (Opcional)</h5>
      <h6 className="text-sans-h6 mb-3">Máximo 1 archivo por región, peso máximo 20MB, formato PDF</h6>
      <p className="text-sans-p-semibold">Regiones asociadas a la competencia:</p>

      {/* por cada region asociada debe haber una fila para subir su organigrama, encabezada por el nombre de la region */}
      <div className="col-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Región</div>
            <div className="ms-5 ps-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
        {organigrama.map((region, index) => (
          <div key={region.pk} className="row neutral-line align-items-center">
            <SubirArchivo
              index={index + 1}
              fileType={region.documento ? "Seleccionado" : "No seleccionado"}
              tituloDocumento={region.region}
              onFileUpload=""
            />
          </div>
        ))}
      </div>

      <div className="my-4">
        <CustomTextarea
          label="Descripción del archivo adjunto (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descripcion_archivo_organigrama_regional"
          name="descripcion_archivo_organigrama_regional"
          value={pasoData?.descripcion_archivo_organigrama_regional}
          onChange={(e) => handleChange('descripcion_archivo_organigrama_regional', e)}
          onBlur={() => handleSave('descripcion_archivo_organigrama_regional')}
          loading={inputStatus.descripcion_archivo_organigrama_regional.loading}
          saved={inputStatus.descripcion_archivo_organigrama_regional.saved}
          maxLength={500} />
      </div>

    </div>
  )
};