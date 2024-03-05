import { useContext, useState, useEffect } from 'react';
import SubirArchivo from '../../forms/subir_archivo';
import CustomTextarea from '../../forms/custom_textarea';
import { FormularioContext } from '../../../context/FormSectorial';
import { useFlujograma } from '../../../hooks/formulario/useFlujograma';
import { usePasoForm } from '../../../hooks/formulario/usePasoForm';

export const Subpaso_dosPuntoCinco = ({ id, stepNumber, data, flujograma, solo_lectura }) => {
  const { handleUpdatePaso} = useContext(FormularioContext);
  const { uploadDocumento } = useFlujograma(id, stepNumber);
  const { dataPaso, refetchTrigger } = usePasoForm(id, stepNumber);
  const [formData, setFormData] = useState({
    paso2: data.paso2 || { descripcion_cualitativa: '' },
  });
  const [inputStatus, setInputStatus] = useState({
    descripcion_cualitativa: { loading: false, saved: false },
  });
  const [flujogramaFiles, setFlujogramaFiles] =  useState(dataPaso?.flujograma || flujograma || []);
  const [iframeSrc, setIframeSrc] = useState( 'https://pdfobject.com/pdf/sample.pdf');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  //visualizar pdf
  const ver = true;

  const handleViewFile = (path) => {
    // const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const url = `${path}`;
    setIframeSrc(url);
    setShowPdfViewer(true);
  };

  useEffect(() => {
    setFlujogramaFiles(dataPaso?.p_2_5_flujograma_competencia || []);
  }, [dataPaso]);

  useEffect(() => {
    setFlujogramaFiles(flujograma || []);
  }, [flujograma]);

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      paso2: {
        ...prevFormData.paso2,
        [inputName]: value,
      },
    }));
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [inputName]: { loading: false, saved: false },
    }));
  };

  const handleSave = async (inputName) => {
    setInputStatus((prevStatus) => ({
      ...prevStatus,
      [inputName]: { ...prevStatus[inputName], loading: true },
    }));
    try {
      const payload = { ...formData };
      const success = await handleUpdatePaso(id, stepNumber, payload);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: success },
      }));
    } catch (error) {
      console.error('Error saving:', error);
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        [inputName]: { loading: false, saved: false },
      }));
    }
  };

  const uploadFile = async (file) => {
    if (flujogramaFiles.length < 5) {
      setUploading(true);
      try {
        await uploadDocumento(id, file);
        refetchTrigger(); // Refetch después de subir para obtener los archivos actualizados
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const eliminarDocFlujo = async (idFlujo) => {
    setDeleting(true);
    try {
      const payload = {
        p_2_5_flujograma_competencia: [{ id: idFlujo, DELETE: true }],
      };
      await handleUpdatePaso(id, stepNumber, payload);
      refetchTrigger();
    } catch (error) {
      console.error('Error al eliminar el flujo', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h4 className="text-sans-h4">
        2.5 Flujograma de ejercicio de la competencia
      </h4>
      <h6 className="text-sans-h6-grey">
        Mínimo 1 archivo, máximo 5 archivos, peso máximo 5MB por archivo,
        formato PDF
      </h6>

      <div className="col-11">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="ms-5">Documento</div>
          </div>
          <div className="me-5">Acción</div>
        </div>
        {flujogramaFiles.map((flujo, index) => (
          <SubirArchivo
            key={flujo.id}
            index={index + 1}
            tituloDocumento={flujo.flujograma_competencia}
            handleFileSelect={(file) => uploadFile(file)}
            handleDelete={() => eliminarDocFlujo(flujo.id)}
            readOnly={solo_lectura}
            onViewFile={() => handleViewFile(flujo.flujograma_competencia)}
            ver={ver}
            archivoDescargaUrl={flujo.flujograma_competencia}
            uploading={uploading}
            deleting={deleting}
          />
        ))}

        {!uploading  && !solo_lectura && flujogramaFiles.length < 5 && (
          <SubirArchivo
            index={flujogramaFiles.length + 1}
            handleFileSelect={(file) => uploadFile(file)}
            onViewFile={handleViewFile || (() => {})}
            readOnly={solo_lectura}
            ver={ver}
          />
        )}
      </div>

      {showPdfViewer && (
        <div className="my-4 col-11">
        <iframe
          id="visorPDF"
          src={iframeSrc}
          title="Vista previa del documento"
        ></iframe>
      </div>
      )}
      

      <div className="mt-4 pb-4 border-bottom">
        <CustomTextarea
          rows={15}
          label="Descripción cualitativa del ejercicio de la competencia en la región"
          placeholder="Describe el ejercicio de la competencia "
          id="descEjercicioCompetencia"
          value={data?.descripcion_cualitativa}
          onChange={(e) => handleChange('descripcion_cualitativa', e)}
          onBlur={() => handleSave('descripcion_cualitativa')}
          loading={inputStatus.descripcion_cualitativa.loading}
          saved={inputStatus.descripcion_cualitativa.saved}
          maxLength={2200}
          readOnly={solo_lectura}
        />
      </div>
    </div>
  );
};
