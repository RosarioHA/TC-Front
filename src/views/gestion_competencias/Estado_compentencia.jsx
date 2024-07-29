import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SummaryDetail } from "../../components/tables/SummaryDetail";
import { PersonsAssigned } from "../../components/tables/PersonsAssigned";
import { VerticalStepper } from "../../components/stepers/VerticalStepper";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useFormularioSubdere } from "../../hooks/revisionFinalSubdere/useFormularioSubdere";
import { useResumenFinal } from "../../hooks/revisionFinalSubdere/useResumenFinal";

const EstadoCompetencia = () =>
{
  const { id } = useParams();
  const { competenciaDetails, loading, error } = useCompetencia(id);
  const { resumen } = useResumenFinal(id);
  const navigate = useNavigate();
  const [ competencia, setCompetencia ] = useState(null);
  const { dataFormSubdere } = useFormularioSubdere(id);
  const mostrarMensajeFinalizada = competenciaDetails.estado === 'Finalizada' && resumen?.formulario_final_enviado === true;

  useEffect(() =>
  {
    if (competenciaDetails)
    {
      setCompetencia(competenciaDetails);
    }
  }, [ competenciaDetails ]);

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleVerRevisionSubdere = () =>
  {
    navigate(`/home/revision_subdere/${id}/paso_1/`)
  }

  if (loading)
  {
    return <div className="d-flex align-items-center flex-column ">
      <div className="text-center text-sans-h5-medium-blue ">Cargando detalles de la competencia...</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>;
  }
  if (error)
  {
    return <div>Error al cargar los detalles: {error.message}</div>;
  }
  if (!competencia)
  {
    return <div>No se encontraron detalles de la competencia</div>;
  }

  const extractFileName = (url) =>
  {
    // Extrae el nombre del archivo después de la última barra (/)
    let fileNameWithExtension = url.split('/').pop();

    // Remover cualquier texto adicional después de ".pdf"
    const pdfIndex = fileNameWithExtension.indexOf('.pdf');
    if (pdfIndex !== -1)
    {
      fileNameWithExtension = fileNameWithExtension.substring(0, pdfIndex + 4); // "+4" para incluir ".pdf"
    }

    return fileNameWithExtension;
  };

  // Ejemplo de uso
  const fileUrl = resumen?.antecedente_adicional_revision_subdere;
  const fileName = fileUrl ? extractFileName(fileUrl) : '';


  const handleDownload = () =>
  {
    {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <>
      <div className="container col-10 col-xxl-11 my-3">
        <div className="py-3 d-flex">
          <div className="align-self-center">
            <button className="btn-secundario-s" onClick={handleBackButtonClick}>
              <i className="material-symbols-rounded me-2">arrow_back_ios</i>
              <p className="mb-0 text-decoration-underline">Volver</p>
            </button>
          </div>
          <nav className="container mx-5" aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style d-flex my-2">
              <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Estado de la Competencia: {competencia.nombre}</li>
            </ol>
          </nav>
        </div>
        <span className="text-sans-Title">Estado de la Competencia</span>
        <div className="my-3">
          <div className="d-flex">
            <span className="badge-tipo mt-1">{competencia.agrupada ? 'Agrupada' : 'Individual'}</span>
            <h1 className="text-sans-h1 mb-4 ms-2">{competencia.nombre}</h1>
          </div>
          <SummaryDetail competencia={competencia} />
        </div>
        <div className="mt-5">
          <div className="text-sans-h2 my-4">Personas asignadas</div>
          <PersonsAssigned
            usuariosSubdere={competencia.usuarios_subdere}
            usuariosDipres={competencia.usuarios_dipres}
            usuariosSectoriales={competencia.usuarios_sectoriales}
            usuariosGore={competencia.usuarios_gore}
          />
        </div>

        {mostrarMensajeFinalizada && (
          <div className="bluesky-container p-3 mt-4">
            <h3 className="text-sans-h3-blue mb-3">Revisión SUBDERE finalizada.</h3>
            <div className="d-flex pt-4 justify-content-between blue-border-top">
              <p className="text-sans-p-blue ">Realizada por {dataFormSubdere?.ultimo_editor?.nombre_completo} (SUBDERE) - {dataFormSubdere?.fecha_ultima_modificacion}</p>
              <button className="text-decoration-underline btn-secundario-s-clear " onClick={handleVerRevisionSubdere}>Ver Revisión SUBDERE</button>
            </div>
            <div>
              {resumen?.antecedente_adicional_revision_subdere ? (
                <>
                  <p className="text-sans-p-blue mt-4">Antecedentes Adicionales</p>
                  <div className="my-1 col-12  mx-2">
                    <div className="d-flex justify-content-between align-items-center gap-2 align-items-center">
                      <div className="d-flex mb-2">
                        <div className="text-sans-p-blue mx-2"><strong>1</strong></div>
                        <div className="text-sans-p-blue mx-4">{fileName}</div>
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
                        <p className="text-sans-p-blue mb-0">{resumen?.descripcion_antecedente}</p>
                      </div>
                    </div>
                  </div>
                </>) : ("")}
            </div>
          </div>
        )}

        <div className="mt-5 mx-0">
          <div className="text-sans-h2 my-3">Etapas de levantamiento de información</div>
          <VerticalStepper etapasObjeto={competencia.resumen_competencia} etapaDatos={competencia} id={id} />
        </div>
      </div>
    </>
  );
};

export default EstadoCompetencia;
