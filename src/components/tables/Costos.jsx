import { useState } from "react";
import CustomTextarea from "../forms/custom_textarea";
import DropdownSelect from "../dropdown/select";
import {RadioButtons} from "../forms/radio_btns"


const Costos = () => {
  const [costos, setCostos] = useState([{ id: 1 }]);

  const agregarCosto = () => {
    const nuevoCosto = { id: costos.length + 1 };
    setCostos([...costos, nuevoCosto]);
  };

  const eliminarCosto = (id) => {
    const costosActualizados = costos.filter(
      (proc) => proc.id !== id
    );
    setCostos(costosActualizados);
  };

  return (
  <>
    {costos.map((costo) => (
    <div key={costo.id} className="col mt-4">
      <div className="row">
        <div className="col">
          <p className="text-sans-p-bold">Subtítulo</p>
          <DropdownSelect
            placeholder="Subtítulos"
            options="" />
        </div>
        <div className="col">
          <p className="text-sans-p-bold">Item</p>
          <DropdownSelect
            placeholder="Ítem"
            options="" />
        </div>
        <div className="col">
          <p className="text-sans-p-bold mb-0">Total Anual</p>
          <p>($M)</p>
          {/* Ponerle la misma clase que Vero haya creado para los otros campos de Costos (subpaso 5.2) */}
          <input></input>
        </div>
        <div className="col">
          <div className="d-flex">
            <p className="text-sans-p-bold mb-0">Etapa</p>
            <p className="ms-2">(Opcional)</p>
          </div>

          <DropdownSelect
            placeholder="Ítem"
            options="" />
        </div>
        <div className="col">
          <p className="text-sans-p-bold">¿Es transversal?</p>
          <RadioButtons
            altA="Si"
            altB="No" />
        </div>
      </div>

      <div className="row pe-3">
        <CustomTextarea
          label="Descripción "
          placeholder="Describe el costo por subtítulo e ítem"
          maxLength={500} />
      </div>

      <div className="d-flex justify-content-end me-2">
      {costos.length > 1 && ( // Condición para mostrar el botón "Eliminar"
            <div className="">
              <button
                className="btn-terciario-ghost mt-3"
                onClick={() => eliminarCosto(costo.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar subtítulo</p>
              </button>
            </div>
          )}
      </div>
    </div>
    ))}
    
    <button
      className="btn-secundario-s m-2"
      onClick={agregarCosto}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar subtítulo</p>
    </button>
  </>
  )
};

export default Costos;
  