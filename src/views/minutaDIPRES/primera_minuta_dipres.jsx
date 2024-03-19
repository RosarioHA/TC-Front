import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompetencia } from "../../hooks/competencias/useCompetencias";
import { useObservacionesSubdere } from "../../hooks/formulario/useObSubdereSectorial";
import { SubirOrganigrama } from "../../components/commons/subirOrganigrama";
import { useEtapa3 } from "../../hooks/minutaDIPRES/useEtapa3";

const PrimeraMinuta = () => {
  const { id } = useParams();
  const { competenciaDetails } = useCompetencia(id);
  const { observaciones } = useObservacionesSubdere(id);
  const { patchArchivoMinuta, archivoSubido, loadingPatch, errorPatch } = useEtapa3();
  const navigate = useNavigate();
  console.log("id", id)
  console.log("archivo subido en minuta dipress", archivoSubido)
  console.log("competenciaDetails", competenciaDetails)
  console.log("observaciones", observaciones)
  console.log("array formularios sectorial", competenciaDetails?.etapa2?.formulario_sectorial)

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleVerFormulario = (id) => {
    navigate(`/home/formulario_sectorial/${id}/paso_1`);
  };

  const handleFileSelect = (file) => {
    patchArchivoMinuta(id, file);
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
      </div>

      <div>
        <h2 className="text-sans-25 mt-5">Subir minuta (Obligatorio)</h2>
        <h6 className="text-sans-h6 mb-4">Mínimo 1 archivo, peso máximo 20MB, formato PDF</h6>
        <SubirOrganigrama 
        handleFileSelect={handleFileSelect}
        />
        {/* ESTOS MENSAJES DE ERROR ELIMINARLOS O MEJORARLOS, SON POR MIENTRAS */}
        {loadingPatch && <p>Cargando...</p>}
        {errorPatch && <p>Error: {errorPatch.message}</p>}
      </div>

      <div className="d-flex justify-content-end my-5 me-3">
        <button 
        className="btn-primario-s"
        disabled={!archivoSubido}
        >
          Enviar minuta
          <i className="material-symbols-rounded me-2">arrow_forward_ios</i>
        </button>
      </div>
      
    </div>
  );
};

export default PrimeraMinuta;