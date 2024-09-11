import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDescargarDocumento } from "../../hooks/competencias/useDownloadPDFFinal";
import { useGenerarDocumento } from '../../hooks/competencias/useGenerarDocumento';
import { useCompetencia } from "../../hooks/competencias/useCompetencias";

export const CardDocumento = ({ id, estadoFinalizado, resumen, editorName, editionDate, antecedentes, descripcion }) => {
  const [pdfGenerado, setPdfGenerado] = useState(false);
  const [fecha, setFecha] = useState(null);
  const { competenciaDetails, fetchCompetenciaDetails } = useCompetencia(id);
  const { generarDocumento, eliminarDocumento } = useGenerarDocumento();
  const { verificarDocumento, verificarPDF, pendiente, descargarDocumento, disponible, error } = useDescargarDocumento(id);
  const navigate = useNavigate();
  const fileUrl = resumen?.antecedente_adicional_revision_subdere;
  const [checking, setChecking] = useState(false);
  
  useEffect(() => {
    const fetchDocumentStatus = async () => {
      await verificarDocumento();
    };

    fetchDocumentStatus();
  }, [verificarDocumento]);

  useEffect(() => {
    if (competenciaDetails) {
      setFecha(competenciaDetails.ultimo_pdf_generado);
    }
  }, [competenciaDetails]);

  useEffect(() => {
    let interval;

    const checkDocumento = async () => {
      try {
        await verificarPDF();
      } catch (error) {
        console.error("Error al verificar el documento:", error);
      }
    };

    if (!disponible && checking) {
      interval = setInterval(() => {
        checkDocumento();
      }, 30000); // Verificar cada 30 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checking, disponible, verificarPDF]);

  useEffect(() => {
    if (!disponible) {
      setChecking(true);
    } else {
      setChecking(false);
    }
  }, [disponible]);

  const generarPDF = async () => {
    setPdfGenerado(true);
    try {
      await generarDocumento(id);
      await fetchCompetenciaDetails(id);
      await verificarPDF();
      if (error) {
        throw new Error(error); // Si hay un error en verificarPDF, lánzalo para que sea capturado
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(error.message || "Error al generar documento, intente nuevamente");
    }
  };

  const actualizarPDF = async () => {
    try {
      await eliminarDocumento(id);
      await generarDocumento(id);
      await fetchCompetenciaDetails(id);
      await verificarPDF();
      if (error) {
        throw new Error(error); // Si hay un error en verificarPDF, lánzalo para que sea capturado
      }
    } catch (error) {
      console.error("Error al actualizar el PDF:", error);
      alert(error.message || "Error al generar documento, intente nuevamente");
    }
  };

  const extractFileName = (url) => {
    let fileNameWithExtension = url.split('/').pop();
    const pdfIndex = fileNameWithExtension.indexOf('.pdf');
    if (pdfIndex !== -1) {
      fileNameWithExtension = fileNameWithExtension.substring(0, pdfIndex + 4);
    }
    return fileNameWithExtension;
  };

  const truncateFileName = (name) => {
    const screenWidth = window.innerWidth;
    let maxLength = screenWidth < 1400 ? 15 : 60;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  const descargarPDF = async () => {
    if (!disponible) {
      return;
    }
    await descargarDocumento();
  };

  const handleVerRevisionSubdere = () => {
    navigate(`/home/revision_subdere/${id}/paso_1/`);
  };

  const fileName = fileUrl ? extractFileName(fileUrl) : '';
  const truncatedFileName = truncateFileName(fileName);

  return (
    <div className="bluesky-container p-3 mt-4">
      {estadoFinalizado ? (
        <>
          <h3 className="text-sans-h3-blue mb-3">Revisión SUBDERE finalizada.</h3>
          <div className="d-flex pt-4 justify-content-between blue-border-top">
            <p className="text-sans-p-blue">Realizada por {editorName} - {editionDate}</p>
            <button className="text-decoration-underline btn-secundario-s-clear" onClick={handleVerRevisionSubdere}>Ver Revisión SUBDERE</button>
          </div>
          {antecedentes && (
            <>
              <p className="text-sans-p-blue mt-4">Antecedentes Adicionales</p>
              <div className="my-1 col-12 mx-2">
                <div className="d-flex justify-content-between align-items-center gap-2 align-items-center">
                  <div className="d-flex mb-2">
                    <div className="text-sans-p-blue mx-2"><strong>1</strong></div>
                    <div className="text-sans-p-blue mx-4">{truncatedFileName}</div>
                  </div>
                  <button className="btn-secundario-s-clear px-2 d-flex align-items-center m-3" onClick={handleDownload}>
                    <span className="text-sans-b-green text-decoration-underline mx-1">Descargar</span>
                    <i className="material-symbols-rounded ms-2">download</i>
                  </button>
                </div>
              </div>
              <div className="my-4 col-11 mx-2">
                <div className="d-flex flex-column textarea-container">
                  <label className="text-sans-p-blue input-label-blue ms-3 ms-sm-0">Descripción del archivo adjunto (Opcional)</label>
                  <div className='textarea-text input-textarea-blue p-3'>
                    <p className="text-sans-p-blue mb-0">{descripcion}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="text-sans-h3-blue mb-3">Descarga el documento con información parcial</h3>
          {fecha === 'Sin registro' ? (
            <>
              <div className="d-flex justify-content-between">
                <p className="text-sans-p-blue my-2">El documento contiene la información completada hasta el momento.</p>
                {pdfGenerado ? (
                  pendiente === false && (
                    <span className="badge-status-pending-lg my-auto">Pendiente</span>
                  )
                ) : (
                  <button className="btn-secundario-s-clear" onClick={generarPDF}>
                    <i className="material-symbols-rounded mx-2">draft</i>
                    <span><u>Generar documento</u></span>
                  </button>
                )}
                {error && <p className="error-text">{error.message}</p>}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <p className="text-sans-p-blue my-2">El documento contiene la información completada hasta el momento.</p>
                {pendiente === false ? (
                  <span className="badge-status-pending-lg my-auto">Pendiente</span>
                ) : (
                  <button className="btn-secundario-s-clear" onClick={descargarPDF}>
                    <i className="material-symbols-rounded mx-2">vertical_align_bottom</i>
                    <span><u>Descargar documento</u></span>
                  </button>
                )}
              </div>
              <div className="d-flex flex-row justify-content-start my-2">
                <div className="text-sans-p-blue my-auto">Último documento generado - {fecha}</div>
                <button className="btn-secundario-s-clear mx-3" onClick={actualizarPDF}>
                  <i className="material-symbols-rounded mx-2">update</i>
                  <span><u>Actualizar documento</u></span>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
