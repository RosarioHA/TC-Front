import { useState, useContext } from "react";
import DropdownSelect from "../../dropdown/select";
import CustomTextarea from "../../forms/custom_textarea";
import CustomInput from "../../forms/custom_input";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_CuatroUno = ({ readOnly, data, listaIndicadores, id, stepNumber }) =>
{
  const { handleUpdatePaso } = useContext(FormularioContext)
  const [indicadores, setIndicadores] = useState([{ id: null }]);



  const handleInputChange = (idIndicador, campo, evento) => {
    const valor = evento.target.value; // Extrae el valor del evento
    setIndicadores(indicadoresActuales =>
        indicadoresActuales.map(indicador =>
            indicador.id === idIndicador ? { ...indicador, [campo]: valor } : indicador
        )
    );
};

  const agregarIndicador = () => {
    if (indicadores[indicadores.length - 1].id !== null) {
      const nuevoIndicador = { id: null };
      setIndicadores([...indicadores, nuevoIndicador]);
    }
  };

  const eliminarIndicador = (id) =>
  {
    const indicadoresActualizados = indicadores.filter(
      (proc) => proc.id !== id
    );
    setIndicadores(indicadoresActualizados);
  };
  console.log(data, id, stepNumber)

  // Transformar listaIndicadores a un array de opciones para el DropdownSelect
  const opcionesIndicadores = Object.entries(listaIndicadores).map(([ key, value ]) => ({
    value: key,
    label: value
  }));

  const handleDropdownChange = (idIndicador, valor) =>
  {
    setIndicadores(indicadoresActuales =>
      indicadoresActuales.map(indicador =>
        indicador.id === idIndicador ? { ...indicador, tipo: valor } : indicador
      )
    );
  };

  const handleSave = async () =>
  {
    try
    {
      // Verificar si todos los indicadores tienen sus campos completos
      const todosCompletos = indicadores.every(indicador =>
      {
        // Asegúrate de que estos campos coincidan con los nombres de tus campos en el estado 'indicadores'
        return indicador.formula_calculo && indicador.descripcion_indicador && indicador.medios_calculo && indicador.verificador_asociado;
      });

      if (!todosCompletos)
      {
        alert("Por favor, completa todos los campos antes de guardar.");
        return; // Detiene la ejecución si no todos los campos están completos
      }

      // Si todos los campos están completos, continúa con la lógica de guardado
      const datosPaso = {
        indicador_desempeno: indicadores, // Asegúrate de que esto coincide con la estructura que espera tu backend
      };
      const exito = await handleUpdatePaso(id, stepNumber, datosPaso);
      if (exito)
      {
        alert("Datos guardados exitosamente");
      } else
      {
        alert("Error al guardar los datos");
      }
    } catch (error)
    {
      console.error("Error en handleSave:", error);
    }
  };

  return (
    <>
      {readOnly ? (
        <div className="container">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="col-3 ms-3">
              <p className="text-sans-p-bold mb-0">Tipo de indicador </p>
              <p className="text-sans-p-grayc">(Obligatorio)</p>
            </div>
            <div className="ms-4">
              <p className="text-sans-p-bold mb-0">Fórmula de cálculo </p>
              <p className="text-sans-p-grayc">(Obligatorio)</p>
            </div>
          </div>

          {/* Se deben generar dinamicamente segun la cantidad de indicadores existentes en el backend     */}
          {indicadores.map((indicador) => (
            <div key={indicador.id}>
              <div className="d-flex neutral-line p-2">
                <p className="text-sans-p-bold mx-3 mt-4">{indicador.id}</p>
                <div className="col-3 mt-2">
                  <CustomInput
                    placeholder="Tipo de indicador"
                    readOnly={true} />
                </div>
                <div className="col mx-4 mt-2">
                  <CustomTextarea
                    placeholder="Formula de cálculo"
                    readOnly={true} />
                </div>
              </div>

              <div className="mt-4 mx-3">
                <CustomTextarea
                  label="Descripción (Obligatorio)"
                  placeholder="Describe el indicador de desempeño"
                  readOnly={true} />
              </div>
              <div className="mt-4 mx-3">
                <CustomTextarea
                  label="Medios utilizados para su cálculo (Obligatorio)"
                  placeholder="Describe los medios utilizados para su cálculo"
                  readOnly={true} />
              </div>
              <div className="mt-4 mx-3">
                <CustomTextarea
                  label="Verificador asociado al indicador (Obligatorio)"
                  placeholder="Describe los medios de verificación del indicador"
                  readOnly={true} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container">
          <div className="d-flex mb-2">
            <div className="ms-4">#</div>
            <div className="col-3 ms-3">
              <p className="text-sans-p-bold mb-0">Tipo de indicador </p>
              <p className="text-sans-p-grayc">(Obligatorio)</p>
            </div>
            <div className="ms-4">
              <p className="text-sans-p-bold mb-0">Fórmula de cálculo </p>
              <p className="text-sans-p-grayc">(Obligatorio)</p>
            </div>
          </div>

          {indicadores.map((indicador) => (
            <div key={indicador.id}>
              <div className="d-flex neutral-line p-2 col-11">
                <p className="text-sans-p-bold mx-3 mt-4">{indicador.id}</p>
                <div className="col-3 mt-2">
                  <DropdownSelect
                    placeholder="Tipo de indicador"
                    options={opcionesIndicadores}
                    value={indicador.tipo || ""}
                    onChange={(valor) => handleDropdownChange(indicador.id, valor)}
                  />
                </div>
                <div className="col me-1 ms-3 mt-2">
                  <CustomTextarea
                    placeholder="Formula de cálculo"
                    maxLength={300}
                    value={indicador.formula_calculo || ""}
                    onChange={(valor) => handleInputChange(indicador.id, 'formula_calculo', valor)}
                  />
                </div>

                {indicadores.length > 1 && (
                  <div className="col-1 me-4">
                    <button
                      className="btn-terciario-ghost mt-3"
                      onClick={() => eliminarIndicador(indicador.id)}
                    >
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">Borrar</p>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 mx-3">
                <CustomTextarea
                  label="Descripción (Obligatorio)"
                  placeholder="Describe el indicador de desempeño"
                  maxLength={300}
                  value={indicador.descripcion_indicador || ""}
                  onChange={(valor) => handleInputChange(indicador.id, 'descripcion_indicador', valor)}
                />
              </div>
              <div className="mt-2 mx-3">
                <CustomTextarea
                  label="Medios utilizados para su cálculo (Obligatorio)"
                  placeholder="Describe los medios utilizados para su cálculo"
                  maxLength={300}
                  value={indicador.medios_calculo || ""}
                  onChange={(valor) => handleInputChange(indicador.id, 'medios_calculo', valor)} />
              </div>
              <div className="mt-2 mx-3">
                <CustomTextarea
                  label="Verificador asociado al indicador (Obligatorio)"
                  placeholder="Describe los medios de verificación del indicador"
                  maxLength={300}
                  value={indicador.verificador_asociado || ""}
                  onChange={(valor) => handleInputChange(indicador.id, 'verificador_asociado', valor)} />
              </div>

            </div>
          ))}
          <div className="d-flex">
            <button
              className="btn-primario-s m-2" // Asegúrate de usar la clase correcta para tu estilo de botón
              onClick={handleSave} // Función que se invocará al hacer clic
            >
              <i className="material-symbols-rounded me-2">save</i>
              Guardar Cambios
            </button>
            {indicadores[indicadores.length - 1].id !== null && (
              <button
                className="btn-secundario-s m-2"
                onClick={agregarIndicador}
              >
                <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">Agregar indicador</p>
              </button>
            )}

          </div>
        </div>
      )}
    </>
  )
};