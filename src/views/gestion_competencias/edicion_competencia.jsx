import { useNavigate } from "react-router-dom";

const EdicionCompetencia = () => {
  const history = useNavigate();

  const handleBackButtonClick = () => {
    history(-1);
  };

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex  align-items-center justify-content-between mb-5">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver</p>
          </button>
          <h3 className="text-sans-h3 ms-3 mb-0">Competencia: $NombreCompetencia</h3>
        </div>
        <button className="btn-secundario-s">
          <i className="material-symbols-rounded me-2">edit</i>
          <p className="mb-0">Editar</p>
        </button> 
      </div>

      <form>
        <div className="mb-4">
          NOMBRE
        </div>

        <div className="mb-4">
          REGION
        </div>

        <div className="mb-4">
          SECTOR
        </div>

        <div className="mb-4">
          AMBITO
        </div>

        <div className="mb-4">
          ORIGEN
        </div>

        <div className="mb-4">
          USUARIOS
        </div>

        <div className="mb-4">
          OFICIO - puede subir otro archivo? solo puede descargar?
        </div>

        <div className="mb-4">
          PLAZO
        </div>

        <button className="btn-primario-s mb-5" type="submit">
          <i className="material-symbols-rounded me-2">save</i>
          <p className="mb-0">Guardar</p>
        </button>

      </form>
    </div>
  );
}

export default EdicionCompetencia;