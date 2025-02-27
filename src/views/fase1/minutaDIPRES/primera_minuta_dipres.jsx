import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../../hooks/competencias/useCompetencias";
import { SubirArchivo } from "../../../components/fase1/commons/subirArchivo";
import { useEtapa3 } from "../../../hooks/fase1/minutaDIPRES/useEtapa3";
import { SuccessMinutaDipres } from "../../../components/success/minutaDipres";
import { useAuth } from "../../../context/AuthContext";

const PrimeraMinuta = () =>
{
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { patchArchivoMinuta } = useEtapa3();
  const [ archivoSeleccionado, setArchivoSeleccionado ] = useState(null);
  const [ isSubmitSuccessful, setIsSubmitSuccessful ] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const minutaEnviada = !!competenciaDetails?.etapa3?.minuta_etapa3_enviada;
  const idEtapa = competenciaDetails?.etapa3?.id
  const [ errorMessage, setErrorMessage ] = useState("");
  const userObservador = userData?.perfil?.includes("Usuario Observador");


  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleVerFormulario = (id) =>
  {
    navigate(`/home/formulario_sectorial/${id}/paso_1`);
  };

  const handleFileSelect = (file) =>
  {
    setArchivoSeleccionado(file);
  };

  const handleEnviarMinuta = () =>
  {
    if (!archivoSeleccionado)
    {
      setErrorMessage("Por favor, seleccione un archivo antes de enviar la minuta.");
      return;
    }
    patchArchivoMinuta(idEtapa, archivoSeleccionado);
    setIsSubmitSuccessful(true);
  };

  return (
    <div className="container col-10 col-xxl-11">
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
                  <table className="col-12" key={formulario.id}>
                    <tbody>
                      <tr
                        className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}>
                        <td className="col-8">{formulario.nombre.replace('Completar formulario Sectorial - ', '')}</td>
                        <td className="">
                          {!userObservador ? (
                            <button className="btn-secundario-s text-decoration-underline" onClick={() => handleVerFormulario(formulario.id)}>
                              Ver observaciones
                            </button>) : (
                            <div className="badge-status-finish">Finalizada</div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))
              ) : (
                competenciaDetails.etapa2.formulario_sectorial.detalle_formularios_sectoriales.map((formulario, index) => (
                  <table className="col-12" key={formulario.id}>
                    <tbody>
                      <tr
                        className={`d-flex justify-content-between p-3 align-items-center ${index % 2 === 0 ? 'neutral-line' : 'white-line'}`}>
                        <td className="col-8">{formulario.nombre.replace('Completar formulario Sectorial - ', '')}</td>
                        <td className="">
                          {!userObservador ? (
                            <button
                              className="btn-secundario-s text-decoration-underline"
                              onClick={() => handleVerFormulario(formulario.id)}
                            >
                              Ver observaciones
                            </button>) : (<div className="badge-status-finish">Finalizada</div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))
              )
            ) : (
              <p>No hay formularios disponibles.</p>
            )}
          </div>

          <div>
            {minutaEnviada ? (
              <h2 className="text-sans-25 mt-5">Minuta DIPRES</h2>
            ) : (
              <h2 className="text-sans-25 mt-5">Subir minuta (Obligatorio)</h2>
            )}
            <h6 className="text-sans-h6 mb-4">Mínimo 1 archivo, peso máximo 20MB, formato PDF</h6>

            {userData?.perfil === 'DIPRES' && (
              <>
                <div className="d-flex justify-content-between py-3 fw-bold col-11">
                  <div className="d-flex mb-2">
                    <div className="ms-2">#</div>
                    <div className="ms-5">Documento</div>
                  </div>
                  <div className="me-5">Acción</div>
                </div>
                <SubirArchivo
                  index="1"
                  handleFileSelect={handleFileSelect}
                  readOnly={minutaEnviada}
                  archivoDescargaUrl={competenciaDetails?.etapa3?.archivo_minuta_etapa3}
                  tituloDocumento={competenciaDetails?.etapa3?.archivo_minuta_etapa3}
                />
              </>
            )}

            {userData?.perfil !== 'DIPRES' && minutaEnviada && (
              <SubirArchivo
                index="1"
                handleFileSelect={handleFileSelect}
                readOnly={minutaEnviada}
                archivoDescargaUrl={competenciaDetails?.etapa3?.archivo_minuta_etapa3}
                tituloDocumento={competenciaDetails?.etapa3?.archivo_minuta_etapa3}
              />
            )}
            {errorMessage && (
              <p className="text-sans-h6-darkred mt-1 mb-0">
                {errorMessage}
              </p>
            )}
            {userData?.perfil !== 'DIPRES' && !minutaEnviada && (
              <p className="text-sans-25 mt-5">Aún no se ha subido Minuta DIPRES.</p>
            )}
          </div>

          <div className="d-flex justify-content-end my-5 me-3">
            {!minutaEnviada && (
              <button
                className="btn-primario-s"
                disabled={!archivoSeleccionado}
                onClick={handleEnviarMinuta}
              >
                Enviar minuta
                <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
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

export default PrimeraMinuta;