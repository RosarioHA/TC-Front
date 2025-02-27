import { useState,  useContext} from "react";
import SubirArchivo from "../../forms/subir_archivo";
import { useFlujograma } from "../../../../hooks/fase1/fomularioGore/useFlujograma";
import { FormGOREContext } from "../../../../context/FormGore";

export const SubUno_dos = ({ flujograma, id, stepNumber, solo_lectura }) => {
  const { uploadDocumento } = useFlujograma(id, stepNumber);
  const { updatePasoGore, refetchTriggerGore  } = useContext(FormGOREContext);
  const [iframeSrc, setIframeSrc] = useState('https://pdfobject.com/pdf/sample.pdf');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const ver = true;

  const handleViewFile = (archivoDescargaUrl) => {
    setIframeSrc(archivoDescargaUrl);
    setShowPdfViewer(true);
  };

  const uploadFile = async (file) => {
    if (flujograma.length < 3) {
      setUploading(true);
      try {
        await uploadDocumento(file); 
        refetchTriggerGore()
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
        flujograma_ejercicio_competencia: [{ id: idFlujo, DELETE: true }]
      };
      await updatePasoGore(payload);
    } catch (error) {
      console.error('Error al eliminar el documento', error);
    } finally {
      setDeleting(false);
    }
  };



  return (
    <div className="col-11">
    <h4 className="text-sans-h4">
      1.2 Flujograma de ejercicio de la competencia:
    </h4>
    <div className="text-sans-h6-primary my-3 col-11">
      <h6>
        A partir de la informacion levantada anteriormente, se debe modelar un flujograma en formato BPM que permita visualizar el ejercicio de la competencia ante una eventual transferencia al Gobierno Regional.
      </h6>
    </div>
    <h6 className="text-sans-h6-grey">
      (Mínimo 1 archivo, máximo 3 archivos, peso máximo 20 MB cada uno, formato PDF)
    </h6>

    <div className="col-12">
      <div className="d-flex justify-content-between py-3 fw-bold">
        <div className="d-flex mb-2">
          <div className="ms-4">#</div>
          <div className="ms-5">Documento</div>
        </div>
        <div className="me-5">Acción</div>
      </div>
      {/* Renderiza componentes SubirArchivo para archivos existentes */}
      {flujograma?.map((flujo, index) => (
        <SubirArchivo
          key={flujo.id}
          index={index + 1}
          tituloDocumento={flujo.documento} 
          handleFileSelect={(file) => uploadFile(file)}
          handleDelete={() => eliminarDocFlujo(flujo.id)}
          readOnly={solo_lectura}
          onViewFile={() => handleViewFile(flujo.documento)} 
          ver={ver}
          archivoDescargaUrl={flujo.documento} 
          uploading={uploading}
          deleting={deleting}
        />
      ))}
      {!uploading && !solo_lectura && flujograma?.length < 3 && (
        <SubirArchivo
          index={flujograma?.length + 1}
          handleFileSelect={(file) => uploadFile(file)}
          onViewFile={handleViewFile}
          readOnly={solo_lectura}
          ver={ver}
        />
      )}
    </div>

    {showPdfViewer && (
      <div className="my-4 pe-5 col-11">
        <iframe
          id="visorPDF"
          src={iframeSrc}
          title="Vista previa del documento"
          className="h-20"
        ></iframe>
      </div>
    )}
  </div>
  );
};
