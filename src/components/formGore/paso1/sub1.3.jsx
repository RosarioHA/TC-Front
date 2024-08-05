import { useContext, useState, useEffect } from 'react';
import { SubirOrganigrama } from '../../commons/subirOrganigrama';
import CustomTextarea from '../../forms/custom_textarea';
import { FormGOREContext } from '../../../context/FormGore';

export const SubUno_Tres = ({ pasoData, id, stepNumber, solo_lectura }) => {
  const { updatePasoGore, handleUploadFiles } = useContext(FormGOREContext);
  const [descripcionGore, setDescripcionGore] = useState(
    pasoData?.descripcion_organigrama_gore
  );
  const [inputStatus, setInputStatus] = useState({
    descripcion_organigrama_gore: { loading: false, saved: false },
    organigrama_gore: { loading: false, saved: false },
  });

  useEffect(() => {
    if (pasoData && pasoData.paso1_gore) {
      setDescripcionGore(
        pasoData.paso1_gore.descripcion_organigrama_gore || ''
      );
    }
  }, [pasoData]);

  const ver = false;

  const handleBlur = async () => {
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      descripcion_organigrama_gore: { loading: true, saved: false },
    }));

    const payload = {
      id,
      paso1_gore: { descripcion_organigrama_gore: descripcionGore },
    };
    await updatePasoGore(payload, []);
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      descripcion_organigrama_gore: { loading: false, saved: true },
    }));
  };

  const handleDescripcionChange = (e) => {
    setDescripcionGore(e.target.value);
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      descripcion_organigrama_gore: { loading: false, saved: false },
    }));
  };

  const handleFileSelect = async (file, fieldName) => {
    try {
      const archivos = new FormData();
      archivos.append(`paso${stepNumber}_gore.${fieldName}`, file);
  
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [fieldName]: { ...prevStatus[fieldName], loading: true },
      }));
  
      await handleUploadFiles(id, stepNumber, archivos, fieldName);
  
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [fieldName]: { loading: false, saved: true },
      }));
    } catch (error) {
      setInputStatus(prevStatus => ({
        ...prevStatus,
        [fieldName]: { loading: false, saved: false },
      }));
    }
  };
  
  return (
    <>
      <div className="pe-5 me-5 mt-4 col-12">
        <h4 className="text-sans-h4">
          1.3 Organigrama del Gobierno Regional que identifique dónde se alojará
          la competencia
        </h4>
        <div className="text-sans-h6-primary mb-4 col-11">
          <h6>
            Se debe incorporar un organigrama del Gobierno Regional que
            establezca claramente la División, Departamento y/o Unidad donde se
            alojará la competencia.
          </h6>
        </div>
        <h6 className="text-sans-h6">
          (Máximo 1 archivo, peso máximo 20 MB, formato PDF)
        </h6>

        <div className="col-12">
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
              fieldName="organigrama_gore"
              handleFileSelect={handleFileSelect}
              loading={inputStatus.organigrama_gore.loading}
              tituloDocumento={pasoData?.organigrama_gore}
              ver={ver}
              archivoDescargaUrl={pasoData?.organigrama_gore}
              readOnly={solo_lectura}
            />
          </div>
        </div>

        <div className="my-4 col-12">
          <CustomTextarea
            label="Descripción del archivo adjunto (Opcional)"
            placeholder="Describe el archivo adjunto"
            id="descripcion_organigrama_gore"
            name="descripcion_organigrama_gore"
            value={pasoData?.descripcion_organigrama_gore}
            onChange={handleDescripcionChange}
            onBlur={handleBlur}
            loading={inputStatus.descripcion_organigrama_gore.loading}
            saved={inputStatus.descripcion_organigrama_gore.saved}
            maxLength={500}
            readOnly={solo_lectura}
          />
        </div>
      </div>
    </>
  );
};
