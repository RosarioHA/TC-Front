import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/forms/dropdown_select";
import DropdownCheckboxBuscador from "../../components/forms/dropdown_checkbox_buscador";
import DropdownSelectBuscador from "../../components/forms/dropdown_select_buscador";

const CreacionUsuario = () => {
  const [estado, setEstado] = useState('inactivo');
  const [activeButton, setActiveButton] = useState(null);
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState({});
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [sectorSeleccionado, setSectorSeleccionado] = useState(null);
  const [regionSeleccionada, setRegionSeleccionada] = useState(null);


  // Opciones selectores y checkboxes, luego vendran desde el backend
  const opcionesPerfil = ['SUBDERE', 'Sectorial', 'DIPRES', 'GORE'];
  const opcionesSector = ['un sector', 'otro sector','organismo random'];
  const regiones = ['Arica y Parinacota', 'Magallanes', 'Metropolitana de Santiago', 'O`Higgins']
  const opcionesCompetencia = ['Una competencia x', 'compilado', 'complejo', 'CoMpOnEnTe', 'compadre', 'Otra competencia x'];

  // Maneja boton de volver atras.
  const history = useNavigate();
  const handleBackButtonClick = () => {
    history(-1);
  };

  // Callback que recibe las opciones de DropdownCheckbox de Perfil.
  const handlePerfilChange = (perfil) => {
    setPerfilSeleccionado(perfil);
    console.log("perfil seleccionado", perfilSeleccionado)
  };

  // Callback que recibe las opciones de DropdownSelectBuscador de Sector
  const handleSectorChange = (sector) => {
    setSectorSeleccionado(sector);
    console.log("sector seleccionado", sectorSeleccionado)
  }

  // Callback que recibe las opciones de DropdownSelectBuscador de Sector
  const handleRegionChange = (region) => {
    setRegionSeleccionada(region);
    console.log("region seleccionada", regionSeleccionada)
  }

  // Maneja cambio de Estado del usuario.
  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setActiveButton(nuevoEstado);
    console.log('estado seleccionado', estado)
  };

  // Callback que maneja competencias seleccionadas y su eliminacion.
  const handleCompetenciasChange = useCallback(
    (selectedOptions) => {
      const updatedCompetencias = {};
      selectedOptions.forEach((competencia) => {
        updatedCompetencias[competencia] = true;
      });
      setCompetenciasSeleccionadas(updatedCompetencias);
    },
    []
  );
  const handleRemoveCompetencia = (competencia) => {
    const updatedCompetencias = { ...competenciasSeleccionadas };
    delete updatedCompetencias[competencia];
    setCompetenciasSeleccionadas(updatedCompetencias);
  };
  

  return (
    <div className="container my-4">
      <h2 className="text-sans-h2 mb-3">Administrar Usuarios</h2>
      <div className="d-flex  align-items-center mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0">Volver</p>
        </button>
        <h3 className="text-sans-h3 ms-3 mb-0">Crear Usuario</h3>
      </div>

      <div className="col-10">
        <div className="mb-4">
          < CustomInput 
          label="RUT (Obligatorio)"
          placeholder="Escribe el RUT con guión sin puntos."
          id="rut"
          maxLength={null} />
        </div>
        <div className="mb-4">
          < CustomInput 
          label="Nombre Completo (Obligatorio)"
          placeholder="Escribe el nombre completo."
          id="nombre"
          maxLength={null} />
        </div>
        <div className="mb-4">
          < CustomInput 
          label="Correo electrónico"
          placeholder="Escribe el correo electrónico del usuario."
          id="mail"
          maxLength={null} />
        </div>
        <div className="mb-4">
          < DropdownSelect 
          label="Elige el perfil de usuario (Obligatorio)"
          placeholder="Elige el perfil de usuario"
          options={opcionesPerfil}
          onSelectionChange={handlePerfilChange} />
        </div>

        {/* Se generan condicionalmente nuevos componentes para el detalle de usuarios GORE y Sectorial */}
        {perfilSeleccionado === "Sectorial" && (
          <>
            <div className="d-flex mb-4 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="">Al usuario Sectorial debes asignarle un organismo. </h6>
            </div>
            <div className="mb-4">
              <DropdownSelectBuscador
                label="Elige el organismo al que pertenece (Obligatorio)"
                placeholder="Elige un organismo"
                options={opcionesSector}
                onSelectionChange={handleSectorChange} />
            </div>
          </>
        )}
        {perfilSeleccionado === "GORE" && (
          <>
            <div className="d-flex mb-4 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6 className="">Al usuario GORE debes asignarle una región. </h6>
            </div>
            <div className="mb-4">
              <DropdownSelectBuscador
                label="Elige la región a la que representa (Obligatorio)"
                placeholder="Elige una región"
                options={regiones}
                onSelectionChange={handleRegionChange} />
            </div>
          </>
        )}

        <div className="mb-5">
          <h5 className="text-sans-h5">Estado</h5>
          <div className="d-flex mb-5">
            <button
            className={` ${activeButton === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
            onClick={() => handleEstadoChange('activo')}>
              <p className="mb-0 text-decoration-underline">Activo</p>
              {activeButton === 'activo' && <i className="material-symbols-rounded ms-2">check</i>}
            </button>
            <button
            className={`ms-2 ${activeButton === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
            onClick={() => handleEstadoChange('inactivo')}>
              <p className="mb-0 text-decoration-underline">Inactivo</p>
              {activeButton === 'inactivo' && <i className="material-symbols-rounded ms-2">check</i>}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="my-3">
            < DropdownCheckboxBuscador 
            label="Competencia Asignada (Opcional)"
            placeholder="Busca el nombre de la competencia"
            options={opcionesCompetencia}
            selectedOptions={Object.keys(competenciasSeleccionadas)}
            onSelectionChange={handleCompetenciasChange}
            />
          </div> 
        
          <div className="d-flex mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="">Si la competencia no está creada, debes crearla primero y luego asociarle un usuario. </h6>
          </div>
        </div>

        {Object.keys(competenciasSeleccionadas).length > 0 && (
          <div className="mb-5">
            <table>
              <thead className="">
                <tr className="">
                  <th className="col-1"> <p className="ms-4">#</p> </th>
                  <th className="col-5"> <p >Competencia</p> </th>
                  <th className="col-1"> <p className="ms-2">Acción</p> </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(competenciasSeleccionadas).map((competencia, index) => (
                  <tr key={competencia} className={index % 2 === 0 ? 'neutral-line' : 'white-line'}>
                    <td> <p className="ms-4 my-3">{index + 1}</p> </td>
                    <td> <p className="my-3">{competencia}</p> </td>
                    <td>
                      <button className="btn-terciario-ghost" onClick={() => handleRemoveCompetencia(competencia)}>
                        <p className="mb-0 text-decoration-underline">Eliminar</p>
                        <i className="material-symbols-rounded ms-2">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <button className="btn-primario-s mb-5">
          <p className="mb-0">Crear Usuario</p>
          <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
        </button>

      </div>
    </div>
  );
}

export default CreacionUsuario;