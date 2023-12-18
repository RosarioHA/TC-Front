//Este componente es una tabla, donde la primera columna muestra un selector y la segunda se divide en filas correspondientes a dicho titulo. Se pueden agregar filas con boton "Agregar otro"
import { useState } from "react";
import CustomInput from '../forms/custom_input'
import DropdownSelect from '../dropdown/select'

const TablaEncabezadoSelector = ({options, isEditable, title}) => {
  const [filas, setFilas] = useState([1]);

  const agregarOtraFila = () => {
    const nuevaFila = {
      id: filas.length + 1,
      nombre: "",
      descripcion: "",
    };
    setFilas([...filas, nuevaFila]);
  };

  const eliminarFila = (id) => {
    const nuevasFilas = filas.filter((fila) => fila.id !== id);
    setFilas(nuevasFilas);
  };

  // const handleInputChange = (id, campo, valor) => {
  //   const nuevasFilas = filas.map((fila) =>
  //     fila.id === id ? { ...fila, [campo]: valor } : fila
  //   );
  //   setFilas(nuevasFilas);
  // };

  return (
    <div className="">
      <div className="row border">
      <div className="col p-3">
          {isEditable ? (
            <DropdownSelect options={options} />
          ) : (
            <p className="ms-2 my-2">{title}</p>
          )}
        </div>

        <div className="col-10 border p-2">
          
          {filas.map((fila) => (
            <div key={fila.id} className="border row">
              <div className="col-10 p-3">
                <div className="mt-2 mb-4">
                  < CustomInput
                    label="Nombre"
                    placeholder="Nombre ministerio o servicio"
                    disabled={false}
                    maxLength={300}
                  />
                </div>
                <div className="mb-2">
                  < CustomInput 
                    label="Descripción"
                    placeholder="Descripción"
                    disabled={false}
                    maxLength={300}
                  />
                </div> 
              </div>

              <div className="col d-flex align-items-center">
                <button 
                className="btn-terciario-ghost"
                onClick={() => eliminarFila(fila.id)}>
                  <i className="material-symbols-rounded me-2">delete</i>
                  <p className="mb-0 text-decoration-underline">Borrar</p>
                </button>
              </div> 
              
            </div>
          ))}
          <div className="row">
            <div className="p-2">
              <button className="btn-secundario-s m-2" onClick={agregarOtraFila}>
                <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">Agregar Otro</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaEncabezadoSelector;