import { useContext, useState, useCallback } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import SubirArchivo from "../../forms/subir_archivo";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_dos = ({ pasoData , organigrama}) => {

  const {
    updatePaso,
    isUpdatingPaso,
    updatePasoError,
    id,
    stepNumber
  } = useContext(FormularioContext);
  const [ organigramaNacional, setOrganigramaNacional ] = useState(pasoData.organigrama_nacional || '');
  const [ descripcionOrganigramaNacional, setDescripcionOrganigramaNacional ] = useState('');
  const [ organigramasRegionales, setOrganigramasRegionales ] = useState({});


  const handleDescripcionChange = (event) => {
    setDescripcionOrganigramaNacional(event.target.value);
  };

  const handleDescripcionBlur = async () => {
    await handleSubmit();
  };

  const handleFileUploadRegional = (file, regionId) => {
    setOrganigramasRegionales(prev => ({ ...prev, [ regionId ]: file }));
  };

  const handleFileUpload = async (file, index) => {
    if (index === 1)
    { // Por ejemplo, si es el organigrama nacional
      setOrganigramaNacional(file);
    }
    // Aquí puedes manejar otros casos para otros archivos
    await handleSubmit();
  };

  const handleSubmit = useCallback(async () => {
    const formData = new FormData();

    // Agrega los campos de texto y los archivos al objeto FormData
    formData.append('descripcion_archivo_organigrama_regional', descripcionOrganigramaNacional);
    if (organigramaNacional) {
      formData.append('organigrama_nacional', organigramaNacional);
    }

    // Incluye archivos regionales si son relevantes
    Object.entries(organigramasRegionales).forEach(([ regionId, file ]) => {
      if (file) {
        formData.append(`organigrama_regional_${regionId}`, file);
      }
    });

    try {
      await updatePaso(id, stepNumber, formData);
    } catch (error) {
      // Manejar los errores
    }
  }, [ descripcionOrganigramaNacional, organigramaNacional, organigramasRegionales, updatePaso, id, stepNumber ]);

  if (!pasoData) {
    return <div>Cargando datos...</div>;
  }
  if (isUpdatingPaso) {
    return <div>Cargando...</div>;
  }
  if (updatePasoError) {
    return <div>Error: {updatePasoError.message}</div>;
  }

  return (
    <div className="pe-5 me-5">
      <h4 className="text-sans-h4">1.2 Organización Institucional</h4>
      <div className="text-sans-h6-primary mb-4">
        <h6>
          En esta sección se debe representar gráficamente la estructura orgánica
          de la institución a nivel nacional y regional, incluyendo el numero de funcionarios en las unidades intervinientes
          (departamento, division u otro) involucradas en el ejercicio de la competencia.
        </h6>
      </div>

      <h5 className="text-sans-h5">Organigrama Nacional (Obligatorio)</h5>
      <h6 className="text-sans-h6">Máximo 1 archivo, peso máximo 20MB, formato PDF</h6>

      <div className="ps-3">
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
            fileType={organigramaNacional ? "Seleccionado" : "No seleccionado"}
            onFileUpload={(file) => handleFileUpload(file, 1)}
          />
        </div>
      </div>

      <div className="mt-4">
        <CustomTextarea
          label="Descripción del archivo adjunto (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descOrganigramaNacional"
          value={descripcionOrganigramaNacional}
          onChange={handleDescripcionChange}
          onBlur={handleDescripcionBlur}
          maxLength={500}
        />
      </div>

    <h5 className="text-sans-h5 mt-4">Organigrama Regional (Opcional)</h5>
    <h6 className="text-sans-h6 mb-3">Máximo 1 archivo por región, peso máximo 20MB, formato PDF</h6>
    <p className="text-sans-p-semibold">Regiones asociadas a la competencia:</p>

      {/* por cada region asociada debe haber una fila para subir su organigrama, encabezada por el nombre de la region */}
      <div className="ps-3">
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
              onFileUpload={(file) => handleFileUploadRegional(file, region.pk)}
            />
          </div>
        ))}
      </div>

      <div className="my-4">
        <CustomTextarea
          label="Descripción del archivo(s) adjunto(s) (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descOrganigramaRegional"
          maxLength={500} />
      </div>

    </div>
  )
};