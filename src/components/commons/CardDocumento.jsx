import React from 'react'
import { useNavigate } from "react-router-dom";

export const CardDocumento = ({id, estadoFinalizado, resumen, editorName, editionDate, btnRevision, antecedentes, descripcion }) =>
{
  const navigate = useNavigate();
  const fileUrl = resumen?.antecedente_adicional_revision_subdere;


  //condiciones prueba 
  const updateDate = "26/08/2024 - 10:26"
  const pendiente = true;
  const documentReady = true;


  const extractFileName = (url) =>
  {
    // Extrae el nombre del archivo después de la última barra (/)
    let fileNameWithExtension = url.split('/').pop();

    // Remover cualquier texto adicional después de ".pdf"
    const pdfIndex = fileNameWithExtension.indexOf('.pdf');
    if (pdfIndex !== -1)
    {
      fileNameWithExtension = fileNameWithExtension.substring(0, pdfIndex + 4); 
    }

    return fileNameWithExtension;
  };
  const truncateFileName = (name) =>
  {
    const screenWidth = window.innerWidth;
    let maxLength = screenWidth < 1400 ? 15 : 60;

    if (name.length > maxLength)
    {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  const handleDownload = () =>
  {
    {
      window.open(fileUrl, '_blank');
    }
  };
  const fileName = fileUrl ? extractFileName(fileUrl) : '';
  const truncatedFileName = truncateFileName(fileName);


  const handleVerRevisionSubdere = () =>{
    navigate(`/home/revision_subdere/${id}/paso_1/`)
  }

  return (
    <div className="bluesky-container p-3 mt-4">
      {estadoFinalizado? (
        <>
          <h3 className="text-sans-h3-blue mb-3">Revisión SUBDERE finalizada.</h3>
          <div className="d-flex pt-4 justify-content-between blue-border-top">
            <p className="text-sans-p-blue ">Realizada por {editorName} - {editionDate}</p>
            <button className="text-decoration-underline btn-secundario-s-clear "
              onClick={handleVerRevisionSubdere}>Ver Revisión SUBDERE</button>
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
        </>
        ) : (
        <>
          <h3 className="text-sans-h3-blue mb-3">Descarga el documento con información parcial</h3>
          <div className="d-flex pt-4 justify-content-between blue-border-top my-3">
            <p className="text-sans-p-blue my-2 ">El documento contiene la información completada hasta el momento.</p>
            {!documentReady ? (
              <>
                {!pendiente ? (
                  <button className="btn-secundario-s-clear " onClick="">
                    <i className="material-symbols-rounded mx-2">draft</i>
                    <span><u>Generar documento</u></span>
                  </button>) : (<span className="badge-status-pending-lg my-auto">Pendiente</span>)}

              </>) : (
              <button className="btn-secundario-s-clear " onClick="">
                <i className="material-symbols-rounded mx-2">vertical_align_bottom</i>
                <span><u>Descargar documento</u></span>
              </button>)}
          </div>
          {documentReady ? (
            <div className="d-flex align-items-center my-2">
              <div className="text-sans-p-blue">Último documento generado - {updateDate}</div>
              <button className="btn-secundario-s-clear mx-3" onClick="">
                <i className="material-symbols-rounded mx-2">update</i>
                <span><u>Actualizar documento</u></span>
              </button>
            </div>) : ("")}
        </>
        )}
    </div>
  )
}
