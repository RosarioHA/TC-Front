import { useContext, useState, useEffect } from 'react';
import CustomTextarea from '../../forms/custom_textarea';
import { SubirOrganigrama } from '../../commons/subirOrganigrama';
import { FormularioContext } from '../../../context/FormSectorial';
import { SubirArchivoRegiones } from '../../forms/subirArchivoRegiones';
import { useFileRegional } from '../../../hooks/formulario/useFileRegional';

export const Subpaso_dos = ({
  pasoData,
  organigrama,
  id,
  stepNumber,
  solo_lectura,
}) => {
  const { updatePasoError, handleUpdatePaso, handleUploadFiles } =
    useContext(FormularioContext);
  const { uploadFile } = useFileRegional();
  const [ hasChanged, setHasChanged ] = useState(false);
  const [ formData, setFormData ] = useState({
    paso1: pasoData.paso1 || {
      descripcion_archivo_organigrama_regional:
        pasoData.descripcion_archivo_organigrama_regional,
      descripcion_archivo_organigrama_nacional:
        pasoData.descripcion_archivo_organigrama_nacional,
    },
  });

  const [ inputStatus, setInputStatus ] = useState({
    descripcion_archivo_organigrama_regional: { loading: false, saved: false },
    descripcion_archivo_organigrama_nacional: { loading: false, saved: false },
    organigrama_nacional: { loading: false, saved: false },
  });

  useEffect(() => {
    if (pasoData && pasoData.paso1) {
      setFormData({ paso1: pasoData.paso1 });
    }
  }, [ pasoData ]);

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [ formData ]);

  const handleChange = (inputName, e) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      paso1: {
        ...prevFormData.paso1,
        [ inputName ]: value,
      },
    }));
    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { loading: false, saved: false },
    }));
    setHasChanged(true);
  }

  const handleSave = async (inputName) => {
    if (!hasChanged) return;

    setInputStatus(prevStatus => ({
      ...prevStatus,
      [ inputName ]: { ...prevStatus[ inputName ], loading: true },
    }));

    const fieldData = {
    paso1: {
      [inputName]: formData.paso1[inputName]
    }
    };

    try{
      const success = await handleUpdatePaso(id, stepNumber, fieldData);
      if (success) {
        setHasChanged(false);
      }
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: true },
      }));
    } catch (error) {
      console.error('Error saving:', error);
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [ inputName ]: { loading: false, saved: false },
      }));
    }
  };

  const handleFileSelect = async (file, fieldName) => {
    try {
      const archivos = new FormData();
      archivos.append(fieldName, file);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { ...prevStatus[ fieldName ], loading: true },
      }));

      await handleUploadFiles(id, stepNumber, archivos, fieldName);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { loading: false, saved: true },
      }));
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { loading: false, saved: false },
      }));
    }
  };

  const handleFileSelectRegion = async (file, fieldName, regionId) => {
    if (typeof id === 'undefined' || typeof stepNumber === 'undefined') {
      console.error(
        'El ID del formulario o el número de paso no están definidos.'
      );
      return;
    }

    try  {
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { ...prevStatus[ fieldName ], loading: true },
      }));
      await uploadFile(id, regionId, file);

      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { loading: false, saved: true },
      }));
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [ fieldName ]: { loading: false, saved: false },
      }));
    }
  };

  const eliminarDocRegional = async (idRegion) => {
    const payload = {
      organigramaregional: [ {
          id: idRegion,
          documento: null,
        },
      ],
    };

    try {
      await handleUpdatePaso(id, stepNumber, payload);
    } catch (error) {
      console.error('Error al eliminar el organigrama regional:', error);
    }
  };

  if (updatePasoError) {
    return <div>Error: {updatePasoError.message}</div>;
  }

  const ver = false;

  return (
    <div className="pe-5 me-5 mt-4 col-12">
      <h4 className="text-sans-h4">1.2 Organización Institucional</h4>
      <div className="text-sans-h6-primary mb-4 col-12">
        <h6>
          En esta sección se debe representar gráficamente la estructura
          orgánica de la institución a nivel nacional y regional, incluyendo el
          numero de funcionarios en las unidades intervinientes (departamento,
          division u otro) involucradas en el ejercicio de la competencia.
        </h6>
      </div>

      <h5 className="text-sans-h5">Organigrama Nacional (Obligatorio)</h5>
      <h6 className="text-sans-h6">
        Máximo 1 archivo, peso máximo 20MB, formato PDF
      </h6>

      <div className="col-sm-12 col-lg-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
        <div>
          <SubirOrganigrama
            index="1"
            fieldName="organigrama_nacional"
            handleFileSelect={handleFileSelect}
            loading={inputStatus.organigrama_nacional.loading}
            tituloDocumento={pasoData?.organigrama_nacional}
            ver={ver}
            readOnly={solo_lectura}
            archivoDescargaUrl={pasoData?.organigrama_nacional}
          />
        </div>
      </div>

      <div className="mt-4 col-12">
        <CustomTextarea
          label="Descripción del archivo adjunto (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descripcion_archivo_organigrama_nacional"
          name="descripcion_archivo_organigrama_nacional"
          value={pasoData?.descripcion_archivo_organigrama_nacional}
          onChange={(e) =>
            handleChange('descripcion_archivo_organigrama_nacional', e)
          }
          onBlur={() => handleSave('descripcion_archivo_organigrama_nacional')}
          loading={inputStatus.descripcion_archivo_organigrama_nacional.loading}
          saved={inputStatus.descripcion_archivo_organigrama_nacional.saved}
          maxLength={500}
          readOnly={solo_lectura}
        />
      </div>

      <h5 className="text-sans-h5 mt-4">Organigrama Regional (Opcional)</h5>
      <h6 className="text-sans-h6 mb-3">
        Máximo 1 archivo por región, peso máximo 20MB, formato PDF
      </h6>
      <p className="text-sans-p-semibold">
        Regiones asociadas a la competencia:
      </p>

      <div className="col-sm-12 col-lg-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2 col-9">
            <div className="mx-3">#</div>
            <div className="me-5 ms-2 pe-5 ">Región</div>
            <div className="mx-5 pe-5">Documento</div>
          </div>
          <div className="me-5 col-4">Acción</div>
        </div>
        {organigrama?.map((region, index) => (
          <SubirArchivoRegiones
            key={region.id}
            index={index + 1}
            region={region.region}
            archivoId={region.id}
            tituloDocumento={region.documento}
            fileType={
              formData.paso1.organigramaregional &&
                formData.paso1.organigramaregional[ region.id ]
                ? 'Archivo Seleccionado: ' +
                formData.paso1.organigramaregional[ region.id ].name
                : 'No seleccionado'
            }
            handleFileSelect={(file) =>
              handleFileSelectRegion(file, 'organigramaregional', region.id)
            }
            handleDelete={() => eliminarDocRegional(region.id)}
            readOnly={solo_lectura}
            archivoDescargaUrl={region?.documento}
          />
        ))}
      </div>

      <div className="my-4">
        <CustomTextarea
          label="Descripción del archivo adjunto (Opcional)"
          placeholder="Describe el archivo adjunto"
          id="descripcion_archivo_organigrama_regional"
          name="descripcion_archivo_organigrama_regional"
          value={pasoData?.descripcion_archivo_organigrama_regional}
          onChange={(e) =>
            handleChange('descripcion_archivo_organigrama_regional', e)
          }
          onBlur={() => handleSave('descripcion_archivo_organigrama_regional')}
          loading={inputStatus.descripcion_archivo_organigrama_regional.loading}
          saved={inputStatus.descripcion_archivo_organigrama_regional.saved}
          maxLength={500}
          readOnly={solo_lectura}
        />
      </div>
    </div>
  );
};
