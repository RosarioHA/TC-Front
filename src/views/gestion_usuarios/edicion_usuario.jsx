import { useNavigate } from "react-router-dom";

const EdicionUsuario = () => {
  const history = useNavigate();

  const handleBackButtonClick = () => {
    history(-1);
  };

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Administrar Usuarios</h2>
      <div className="d-flex  align-items-center justify-content-between mb-5">
        <div className="d-flex align-items-center">
          <button className="btn-secundario-s" onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver</p>
          </button>
          <h3 className="text-sans-h3 ms-3 mb-0">Perfil de: $NombreUsuario</h3>
        </div>
        <button className="btn-secundario-s">
          <i className="material-symbols-rounded me-2">edit</i>
          <p className="mb-0">Editar</p>
        </button> 
      </div>

      <form>
        <div className="mb-4">
          RUT
        </div>

        <div className="mb-4">
          NOMBRE
        </div>

        <div className="mb-4">
          CORREO
        </div>

        <div className="mb-4">
          PERFIL
        </div>

        <div className="mb-4">
          ESTADO
        </div>

        <div className="mb-4">
          COMPETENCIAS
        </div>

        <button className="btn-primario-s mb-5" type="submit">
          <i className="material-symbols-rounded me-2">save</i>
          <p className="mb-0">Guardar</p>
        </button>

      </form>
    </div>
  );
}

export default EdicionUsuario;