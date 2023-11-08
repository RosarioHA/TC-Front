import { useState } from "react";
import CustomInput from "../components/forms/custom_input";
import CustomTextarea from "../components/forms/custom_textarea";
import DropdownSelect from "../components/forms/dropdown_select";
import DropdownCheckbox from "../components/forms/dropdwon_checkbox";
import InputSearch from "../components/forms/Input_search";
import { TableCheckbox } from "../components/tables/TableCheck";
import { columnTitlesUser, userData } from "../Data/Usuarios";

const Home = () =>
{
  const [ selectedValue, setSelectedValue ] = useState(null);
  const options = [ 'Alternativa 1', 'Alternativa 2', 'Alternativa 3' ];

  // Funcion callback que recibe las opciones del checkbox seleccionado. Se entrega como parametro al componente DropdownCheckbox.
  const handleCheckboxChange = (selectedOptions) =>
  {
    console.log('Selecciones:', selectedOptions);
  };

  // Funcion callback que recibe la opcion elegida. Se entrega como parametro a DropdownSelect
  const handleSelectChange = (selectedOption) =>
  {
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
          <button className="btn-danger my-2">Danger</button>
          <button className="btn-sidebar my-2">sidebar</button>

          <button className='btn-logout my-2'>logout</button>
          <div>Input - Selecte </div>
          <div className="my-3">
            < CustomInput
              label="Input"
              placeholder="ingresa tu informacion"
              id="idpersonalizado1"
              maxLength={80} />
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
            <InputSearch
              placeholder='Buscar documento por palabras claves' />
          </div>
          <div>Tablas</div>
          <TableCheckbox
            columnTitles={columnTitlesUser}
            data={userData}
            itemType="usuarios"
            renderRow={(user, isChecked, handleCheckboxChange) => (
              <tr key={user.id}>
                <th scope="row"> 
                <input
                  type="checkbox"
                  className="check my-3"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(user.id)}
                />
                </th>
                <td className="pt-3"><u className="text-sans-p my-4">{user.nombre}</u></td>
                <td className="text-primary pt-4">{
                  user.competenciaAsociada.length === 0
                    ? 'No asociada'
                    : user.competenciaAsociada.length > 2
                      ? '+3 Competencias'
                      : user.competenciaAsociada.join(', ')
                }</td>
                <td >
                  <span className={`badge my-3 ${user.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}` }>
                    {user.estado}
                  </span>
                </td>
                <td className="pt-4">
                  <span className="badge-type">
                    {user.tipoUsuario}
                  </span>
                </td>
                <td>
                  <button className="btn-secundario-s btn-sm align-self-center"><u>{user.accion}</u></button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;