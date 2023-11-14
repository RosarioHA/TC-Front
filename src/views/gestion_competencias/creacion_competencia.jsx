import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/forms/custom_input";
import DropdownCheckbox from "../../components/forms/dropdown_checkbox";
import DropdownSelect from "../../components/forms/dropdown_select";

const CreacionCompetencia = () => {
  const [regionesSeleccionadas, setRegionesSeleccionadas] = useState(null);
  const [sectoresSeleccionados, setSectoresSeleccionados] = useState(null);
  const [origenSeleccionado, setOrigenSeleccionado] = useState(null);
  const [ambitoSeleccionado, setAmbitoSeleccionado] = useState(null);
  const history = useNavigate();

  // Maneja boton de volver atras.
  const handleBackButtonClick = () => {
    history(-1);
  };

  // Opciones selectores y checkboxes, luego vendran desde el backend
  const regiones = ['Arica y Parinacota', 'Magallanes', 'Metropolitana de Santiago', 'O`Higgins']
  const sectores = ['Organismo 1', 'Organismo 2', 'Organismo 3', 'Organismo 4']
  const origen = ['Oficio Presidencial', 'Solicitud GORE'];
  const ambito = ['Fomento de las Actividades Productivas', 'Ordenamiento Territorial', 'Desarrollo Social y Cultural']

  // Callbacks que manejan la entrega de informacion desde los componentes del formulario
  const handleRegionesChange = (region) => {
    setRegionesSeleccionadas(region);
    console.log("region seleccionada", regionesSeleccionadas)
  }
  const handleSectorChange = (sector) => {
    setSectoresSeleccionados(sector);
    console.log("sectores seleccionados", sectoresSeleccionados)
  }
  const handleOrigenChange = (origen) => {
    setOrigenSeleccionado(origen);
    console.log("origen seleccionado", origenSeleccionado)
  }
  const handleAmbitoChange = (ambito) => {
    setAmbitoSeleccionado(ambito);
    console.log("ambito seleccionado", ambitoSeleccionado)
  }

  return (
    <div className="container col-10 my-4">
      <h2 className="text-sans-h2 mb-3">Gestión de Competencias</h2>
      <div className="d-flex  align-items-center mb-5">
        <button className="btn-secundario-s" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0">Volver</p>
        </button>
        <h3 className="text-sans-h3 ms-3 mb-0">Crear Competencia</h3>
      </div>

      <div className="col-10 ms-5">
        <form>
          <div className="mb-4">
            < CustomInput 
              label="Nombre de la Competencia (Obligatorio)"
              placeholder="Escribe el nombre de la competencia"
              id="nombre"
              maxLength={null}/>
          </div>
          <div className="mb-4">
            < DropdownCheckbox
            label="Región (Obligatorio)" 
            placeholder="Elige la o las regiones donde se ejercerá la competencia" 
            options={regiones}
            onSelectionChange={handleRegionesChange} />
          </div>
          <div className="mb-4">
            < DropdownCheckbox
              label="Elige el sector de la competencia (Obligatorio)" 
              placeholder="Elige el sector de la competencia" 
              options={sectores}
              onSelectionChange={handleSectorChange} />
          </div>
          <div className="mb-4">
            < DropdownSelect 
            label="Origen de la competencia (Obligatorio)"
            placeholder="Elige el origen de la competencia"
            options={origen}
            onSelectionChange={(selectedOption) => {
              // field.onChange(selectedOption);
              handleOrigenChange(selectedOption);
            }}/>
          </div>
          <div className="mb-4">
            < DropdownSelect 
              label="Elige el ámbito de la competencia (Obligatorio)"
              placeholder="Elige el ámbito de la competencia"
              options={ambito}
              onSelectionChange={(selectedOption) => {
                // field.onChange(selectedOption);
                handleAmbitoChange(selectedOption);
              }}/>
            <div className="d-flex mt-2 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> editable </h6>
            </div>
          </div>
          <div className="mb-4">
            <div className="">COMPONENTE BUSCADOR - VER SI SIRVE LO QUE HIZO VERO</div>
            <div className="d-flex mt-2 text-sans-h6-primary">
              <i className="material-symbols-rounded me-2">info</i>
              <h6> Si aun no creas los usuarios para esta competencia, puedes crear la competencia y asignarle usuario más tarde. </h6>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-sans-h5">Adjunta el oficio correspondiente a la competencia</h5>
            <h6 className="text-sans-h6 mb-4">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>
            <div className="">COMPONENTE SUBIR ARCHIVO</div>
          </div>

          <div className="mb-4">
            < CustomInput 
              label="Plazo para formulario sectorial (Obligatorio)"
              placeholder="Escribe el número de días corridos"
              id="plazo"
              maxLength={null}/>
              <div className="d-flex justify-content-end">
                <h6 className="text-sans-h6-grey mt-1 me-4">Número entre 15 y 30</h6>
              </div>
              <div className="d-flex text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6> El plazo debe ser de 15 a 30 días corridos y se contará desde el día en que asocies un usuario sectorial a la competencia. </h6>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn-primario-s mb-5" type="submit">
              <p className="mb-0">Crear Competencia</p>
              <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
            </button>
          </div>


        </form>
      </div>

    </div>
  );
}

export default CreacionCompetencia;