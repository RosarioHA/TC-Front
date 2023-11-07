import { useState } from "react";
import CustomInput from "../components/forms/custom_input";
import CustomTextarea from "../components/forms/custom_textarea";
import DropdownSelect from "../components/forms/dropdown_select";
import DropdownCheckbox from "../components/forms/dropdwon_checkbox";
import DropdownCheckboxBuscador from "../components/forms/dropdown_checkbox_buscador";

const Home = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const options = ['Alternativa 1', 'Alternativa 2', 'Alternativa 3'];

  // Funcion callback que recibe las opciones del checkbox seleccionado. Se entrega como parametro al componente DropdownCheckbox.
  const handleCheckboxChange = (selectedOptions) => {
    console.log('Selecciones:', selectedOptions);
  };

  // Funcion callback que recibe la opcion elegida. Se entrega como parametro a DropdownSelect
  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    console.log('Selecciones:', selectedValue);
  };

  return (
    <div className="container ms-3 my-5">
      <div>
        <p>LANDING: DASHBOARD RESUMEN</p>
        <div className="d-flex flex-column col-8">
          <button className="btn-primario-s mb-2">Primario S</button>
          <button className="btn-primario-l mb-2">Primario L</button>
          <button className="btn-secundario-s mb-2">Secundario S</button>
          <button className="btn-secundario-l mb-2">Secundario L</button>
          <button className="btn-terciario mb-2">Terciario</button>
          <button className="btn-terciario-ghost">
            <p className="mb-0">Eliminar</p>
            <i className="material-symbols-rounded me-2">delete</i>
          </button>
          <button className="btn-danger mb-5">Danger</button>

          <div className="my-3">
            < CustomInput 
            label="Input"
            placeholder="ingresa tu informacion"
            id="idpersonalizado1"
            maxLength={80}/>
          </div>
          <div className="my-3">
            < CustomTextarea 
            label="Textarea"
            placeholder="ingresa tu informacion"
            id="idpersonalizado2"
            maxLength={500} />
          </div>
          <div className="my-3">
            < DropdownCheckbox 
            label="Dropdown Checkboxes"
            placeholder="Placeholder personalizado"
            options={options}
            onSelectionChange={handleCheckboxChange}
            />
          </div>
          <div>
            < DropdownSelect 
            label="Dropdown Select"
            placeholder="Selecciona una alternativa"
            options={options}
            onSelectionChange={handleSelectChange}
            />
          </div>
          <div className="my-3">
            < DropdownCheckboxBuscador 
            label="Dropdown Checkboxes con Buscador"
            placeholder="Placeholder personalizado"
            options={options}
            onSelectionChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
    </div>
    );
};

export default Home;