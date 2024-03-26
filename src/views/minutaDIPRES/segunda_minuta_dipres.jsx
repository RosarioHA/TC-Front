import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import { SubirArchivo } from "../../components/commons/subirArchivo";
import { useEtapa5 } from "../../hooks/minutaDIPRES/useEtapa5";
import { SuccessMinutaDipres } from "../../components/success/minutaDipres";

const SegundaMinuta = () => {
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { observaciones } = useObservacionesSubdere(id);
  const { patchArchivoMinuta, loadingPatch, errorPatch } = useEtapa5();
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const navigate = useNavigate();
  const etapaFinalizada = !!competenciaDetails?.etapa5?.archivo_minuta_etapa5;


  console.log("id", id)
  console.log("competenciaDetails", competenciaDetails)
  console.log("observaciones", observaciones)

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleVerFormulario = (formularioId) => {
    navigate(`/home/formulario_sectorial/${formularioId}/paso_1`);
  };

  const handleFileSelect = (file) => {
    setArchivoSeleccionado(file);
  };

  const handleEnviarMinuta = () => {
    if (archivoSeleccionado) {
      patchArchivoMinuta(id, archivoSeleccionado);
      setIsSubmitSuccessful(true);
    }
  };

  return (
    <div className="container col-11">
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
            <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${id}`}>Estado de la Competencia: {competenciaDetails?.nombre} </Link></li>
          </ol>
        </nav>
      </div>

      <div>
        <h1 className="text-sans-Title mt-5">Minuta DIPRES</h1>
        <h2 className="text-sans-h1">{competenciaDetails.nombre}</h2>
      </div>

      {!isSubmitSuccessful ? (
      <>
      <div className="border-bottom pb-3">
          <h2 className="text-sans-25 mt-5 mb-4">Formularios sectoriales</h2>
          {competenciaDetails?.etapa2?.formulario_sectorial ? (
            Array.isArray(competenciaDetails.etapa2.formulario_sectorial) ? (
              competenciaDetails.etapa2.formulario_sectorial.map((formulario, index) => (
                <tr
                  className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                  key={formulario.id}
                >
                  <td>{formulario.nombre}</td>
                  <td className="">
                    <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                      Ver observaciones
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              competenciaDetails.etapa2.formulario_sectorial.detalle_formularios_sectoriales.map((formulario, index) => (
                <tr
                  className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                  key={formulario.id}
                >
                  <td>{formulario.nombre}</td>
                  <td className="">
                    <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                      Ver observaciones
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <p>No hay formularios disponibles.</p>
          )}
        </div><div className="border-bottom pb-3">
            <h2 className="text-sans-25 mt-5 mb-4">Formularios GORE</h2>
            {competenciaDetails?.etapa4?.formularios_gore ? (
              Array.isArray(competenciaDetails.etapa4.formularios_gore) ? (
                competenciaDetails.etapa4.formularios_gore.map((formulario, index) => (
                  <tr
                    className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                    key={formulario.id}
                  >
                    <td>{formulario.nombre}</td>
                    <td className="">
                      <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                        Ver observaciones
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                competenciaDetails.etapa4.formularios_gore.detalle_formularios_gore.map((formulario, index) => (
                  <tr
                    className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}
                    key={formulario.id}
                  >
                    <td>{formulario.nombre}</td>
                    <td className="">
                      <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                        Ver observaciones
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <p>No hay formularios disponibles.</p>
            )}
          </div><div>
            {etapaFinalizada ? (
              <h2 className="text-sans-25 mt-5">Minuta DIPRES</h2>
              ) : (
              <h2 className="text-sans-25 mt-5">Subir minuta (Obligatorio)</h2>
            )}
            <h6 className="text-sans-h6 mb-4">Mínimo 1 archivo, peso máximo 20MB, formato PDF</h6>
            <SubirArchivo
              index="1"
              handleFileSelect={handleFileSelect}
              readOnly={etapaFinalizada}
              archivoDescargaUrl={competenciaDetails?.etapa5?.archivo_minuta_etapa5}
              tituloDocumento={competenciaDetails?.etapa5?.archivo_minuta_etapa5} 
            />
            {/* ESTOS MENSAJES DE ERROR ELIMINARLOS O MEJORARLOS, SON POR MIENTRAS */}
            {loadingPatch && <p>Cargando...</p>}
            {errorPatch && <p>Error: {errorPatch.message}</p>}
          </div><div className="d-flex justify-content-end my-5 me-3">
            {!etapaFinalizada && (
              <button
                className="btn-primario-s"
                disabled={!archivoSeleccionado}
                onClick={handleEnviarMinuta}
              >
                Enviar minuta
                <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
              </button>
            )}
          </div>
          </>
      ) : (
        <SuccessMinutaDipres 
        idCompetencia={competenciaDetails?.id}
        />
      )}
      
    </div>
  );
};

export default SegundaMinuta;