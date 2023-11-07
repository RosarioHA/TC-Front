import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownSelect from "../../components/forms/dropdown_select";
import DropdownCheckboxBuscador from "../../components/forms/dropdown_checkbox_buscador";

const CreacionUsuario = () => {
  const [estado, setEstado] = useState('inactivo');
  const opcionesPerfil = ['SUBDERE', 'Sectorial', 'DIPRES', 'GORE']; //Luego vendran desde el back
  const opcionesCompetencia = ['Una competencia x', 'compilado', 'complejo', 'CoMpOnEnTe', 'compadre', 'Otra competencia x', 'Competencia y', 'Competencia z']; //Luego vendran desde el back

  // Funcion callback que recibe las opciones del checkbox seleccionado. Se entrega como parametro al componente DropdownCheckbox.
  const handleCheckboxChange = (perfilSeleccionado) => {
    console.log('Perfil seleccionado:', perfilSeleccionado);
  };

  // Maneja boton de volver atras
  const history = useNavigate();
  const handleBackButtonClick = () => {
    history(-1);
  };

  // Maneja cambio de estado
  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    console.log('estado seleccionado', estado)
  };

  return (
    <div className="container">
      <h2 className="text-sans-h2 mb-3">Administrar Usuarios</h2>
      <div className="d-flex  align-items-center mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">expand_more</i>
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
          onSelectionChange={handleCheckboxChange} />
        </div>

        {/* AQUI APARECE UN SEGUNDO SELECTOR SI SE ESCOGE LA ALTERNATIVA "SECTORIAL" */}

        <div className="mb-5">
          <h5 className="text-sans-h5">Estado</h5>
          <div className="d-flex mb-5">
            <button
            className={` ${estado === 'activo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
            onClick={() => handleEstadoChange('activo')}>
              <p className="mb-0 text-decoration-underline">Activo</p>
            </button>
            <button
            className={`ms-2 ${estado === 'inactivo' ? 'btn-primario-s' : 'btn-secundario-s'}`}
            onClick={() => handleEstadoChange('inactivo')}>
              <p className="mb-0 text-decoration-underline">Inactivo</p>
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="my-3">
            < DropdownCheckboxBuscador 
            label="Competencia Asignada (Opcional)"
            placeholder="Busca el nombre de la competencia"
            options={opcionesCompetencia}
            onSelectionChange={handleCheckboxChange}
            />
          </div> 
        
          <div className="d-flex mt-1 text-sans-h6-primary">
            <i className="material-symbols-rounded me-2">info</i>
            <h6 className="">Si la competencia no está creada, debes crearla primero y luego asociarle un usuario. </h6>
          </div>
        </div>
        
        <button className="btn-primario-s mb-5">
          <p className="mb-0">Crear Usuario</p>
          <i className="material-symbols-rounded me-2">info</i>
        </button>

      </div>
    </div>
  );
}

export default CreacionUsuario;