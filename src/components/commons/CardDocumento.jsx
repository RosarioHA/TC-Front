import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDescargarDocumento } from "../../hooks/competencias/useDownloadPDFFinal";
import { useGenerarDocumento } from '../../hooks/competencias/useGenerarDocumento';

export const CardDocumento = ({ id, estadoFinalizado, resumen, editorName, editionDate, antecedentes, descripcion, fechaDocumento }) => {
  const { generarDocumento, error } = useGenerarDocumento();
  const { verificarDocumento ,descargarDocumento, disponible } = useDescargarDocumento(id);
  const [pendiente, setPendiente] = useState(false);
  const navigate = useNavigate();
  const fileUrl = resumen?.antecedente_adicional_revision_subdere;



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
    descargarDocumento();
  };

  const generarPDF = async () => {
    await generarDocumento(id);
    const isDisponible = await verificarDocumento();
    setPendiente(!isDisponible);
  };

  const handleVerRevisionSubdere = () => {
    navigate(`/home/revision_subdere/${id}/paso_1/`);
  };

  useEffect(() => {
    setPendiente(!disponible);
  }, [disponible]);

  const fileName = fileUrl ? extractFileName(fileUrl) : '';
  const truncatedFileName = truncateFileName(fileName);

  return (
    <>
      {estadoFinalizado ? (
        <div className="bluesky-container p-3 mt-4">
          <h3 className="text-sans-h3-blue mb-3">Revisión SUBDERE finalizada.</h3>
          <div className="d-flex pt-4 justify-content-between blue-border-top">
            <p className="text-sans-p-blue ">Realizada por {editorName} - {editionDate}</p>
            <button className="text-decoration-underline btn-secundario-s-clear " onClick={handleVerRevisionSubdere}>Ver Revisión SUBDERE</button>
          </div>
          <div>
            {antecedentes ? (
              <>
                <p className="text-sans-p-blue mt-4">Antecedentes Adicionales</p>
                <div className="my-1 col-12  mx-2">
                  <div className="d-flex justify-content-between align-items-center gap-2 align-items-center">
                    <div className="d-flex mb-2">
                      <div className="text-sans-p-blue mx-2"><strong>1</strong></div>
                      <div className="text-sans-p-blue mx-4">{truncatedFileName}</div>
                    </div>
                    <button className="btn-secundario-s-clear  px-2 d-flex align-items-center m-3" onClick={handleDownload}>
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
              </>) : ("")}
          </div>
        </div >
      ) : (
        <div className="bluesky-container p-3 mt-4">
          <h3 className="text-sans-h3-blue mb-3">Descarga el documento con información parcial</h3>
          <div className="d-flex pt-4 justify-content-between blue-border-top my-3">
            <p className="text-sans-p-blue my-2">El documento contiene la información completada hasta el momento.</p>
            {!disponible ? (
              <>
                {!pendiente ? (
                  <div>
                    <button className="btn-secundario-s-clear" onClick={generarPDF}>
                      <i className="material-symbols-rounded mx-2">draft</i>
                      <span><u>Generar documento</u></span>
                    </button>
                    {error && <p className="error-text">{error}</p>}
                  </div>
                ) : (
                  <span className="badge-status-pending-lg my-auto">Pendiente</span>
                )}
              </>
            ) : (
              <button className="btn-secundario-s-clear" onClick={descargarPDF}>
                <i className="material-symbols-rounded mx-2">vertical_align_bottom</i>
                <span><u>Descargar documento</u></span>
              </button>
            )}
          </div>
          {disponible ? (
            <div className="d-flex align-items-center my-2">
              <div className="text-sans-p-blue">Último documento generado - {fechaDocumento}</div>
              <button className="btn-secundario-s-clear mx-3" onClick={generarPDF}>
                <i className="material-symbols-rounded mx-2">update</i>
                <span><u>Actualizar documento</u></span>
              </button>
            </div>
          ) : ("")}
        </div>
      )}
    </>
  );
};
