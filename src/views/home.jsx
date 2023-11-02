import CustomInput from "../components/forms/custom_input";
import CustomTextarea from "../components/forms/custom_textarea";
import DropdownCheckbox from "../components/forms/dropdwon_checkbox";

const Home = () => {
  const options = ['Alternativa 1', 'Alternativa 2', 'Alternativa 3'];

  const handleSelectionChange = (selectedOptions) => {
    // Esta función se llamará cuando el usuario confirme las selecciones en el dropdown.
    console.log('Selecciones:', selectedOptions);
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
          <button className="btn-danger mb-5">Danger</button>
          <div className="my-3">
            < CustomInput 
            label="Label del input"
            placeholder="ingresa tu informacion"
            id="idpersonalizado1"
            maxLength={80}/>
          </div>
          <div className="my-3">
            < CustomTextarea 
            label="Label del textarea"
            placeholder="ingresa tu informacion"
            id="idpersonalizado2"
            maxLength={500} />
          </div>
          <div className="my-3">
            < DropdownCheckbox 
            label="Label Dropdown Checkboxes"
            placeholder="Placeholder personalizado"
            options={options}
            onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </div>
    </div>
    );
};

export default Home;