import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioContext } from '../../context/FormSectorial';

const ObservacionesSubdere = () => {
  const { updateFormId, data, loading } = useContext(FormularioContext);
  console.log("data en OS", data)
 
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id en vista OS", id)

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      updateFormId(id);
    }
  }, [id, updateFormId]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!data) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="container col-11">
      <div className="py-3 d-flex">
          <div  className="align-self-center">
            <button className="btn-secundario-s" onClick={handleBackButtonClick}>
              <i className="material-symbols-rounded me-2">arrow_back_ios</i>
              <p className="mb-0 text-decoration-underline">Volver</p>
            </button>
          </div>
          <nav className="container mx-5" aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style d-flex my-2">
              <li className="breadcrumb-item align-self-center"><Link to="/home">Inicio</Link></li>
              <li className="breadcrumb-item align-self-center"><Link to={`/home/estado_competencia/${data.id}`}>Estado de la Competencia: {data.competencia_nombre} </Link></li>
              <li className="breadcrumb-item align-self-center text-sans-p-lightgrey" aria-current="page">Observaciones SUBDERE</li>
            </ol>
          </nav>
        </div>
    </div>
  )
}

export default ObservacionesSubdere;