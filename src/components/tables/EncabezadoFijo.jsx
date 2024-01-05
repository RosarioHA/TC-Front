//Este componente es una tabla, donde la primera columna muestra un titulo y la segunda se divide en filas correspondientes a dicho titulo. Se pueden agregar filas con boton "Agregar otro"
//Estado readOnly muestra la tabla sin los botones para agregar filas, y con sus input en estado disabled
import { useState } from "react";
import CustomInput from '../forms/custom_input'

const TablaEncabezadoFijo = ({ encabezado, readOnly, data }) =>
{
  const [ filas, setFilas ] = useState([ 1 ]);
  console.log('enca', encabezado);
  console.log('data sector', data);

  const { sector_ministerio_servicio, organismo_display } = data


  const agregarOtraFila = () =>
  {
    const nuevaFila = {
      id: filas.length + 1,
      nombre: "",
      descripcion: "",
    };
    setFilas([ ...filas, nuevaFila ]);
  };

  const eliminarFila = (id) =>
  {
    const nuevasFilas = filas.filter((fila) => fila.id !== id);
    setFilas(nuevasFilas);
  };

  return (
    <>
      {readOnly ? (
        <div className="">
          {/* Debe generar una tabla por cada organismo seleccionado */}
          <div className="row border">
            <div className="col p-3">
              <p className="text-sans-p-bold">{encabezado}</p>
            </div>

            <div className="col-10 border p-2">

              {/* Debe generar dinamicamente los secotres de cada organismo seleccionado */}
              {filas.map((fila, index) => (
                <div key={fila.id} className="border row">
                  <div className="col-10 p-3">
                    {index > 1 && (<p>{index + 1}</p>)}
                    <div className="mt-2 mb-4">
                      < CustomInput
                        label="Nombre"
                        placeholder="Nombre ministerio o servicio"
                        readOnly={true}
                      />
                    </div>
                    <div className="mb-2">
                      < CustomInput
                        label="Descripción"
                        placeholder="Descripción"
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      ) : (
        <div className="my-4">
          <div className="row border">
            <div className="col p-3">
              <p>{organismo_display}</p>
            </div>

            <div className="col-10 border p-2">
              <div className="col campo-container p-2 mb-4">
                <p className="ms-2 my-2">{sector_ministerio_servicio}
                </p>
              </div>

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
      )}
    </>
  );
};

export default TablaEncabezadoFijo;