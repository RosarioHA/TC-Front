import { useState } from "react";
import DropdownSelect from "../dropdown/select";

const Personal = () => {
  const [personas, setPersonas] = useState([{ id: 1 }]);
  const [estamento, setEstamento] = useState(null);
  const [mostrarSeccionDinamica, setMostrarSeccionDinamica] = useState(false);

  const agregarPersona = () => {
    const nuevaPersona = { id: personas.length + 1 };
    setPersonas([...personas, nuevaPersona]);
  };
  const eliminarPersona = (id) => {
    const personasActualizados = personas.filter(
      (proc) => proc.id !== id
    );
    setPersonas(personasActualizados);
  };

  return (
    <div className="my-4">
      <div className="col my-4">
        <div className="row">
          <div className="col-1">
            <p className="text-sans-p-bold mt-3">Estamento</p>
          </div>
          <div className="col-2">
            <DropdownSelect 
              placeholder="Estamento"
              options={[
                { value: 'opcion1', label: 'Opción 1' },
                { value: 'opcion2', label: 'Opción 2' },
                { value: 'opcion3', label: 'Opción 3' },
              ]}
              onSelectionChange={(selectedOption) => {
                setEstamento(selectedOption);
                setMostrarSeccionDinamica(true);
              }}/>
          </div> 
        </div>

        {/* aparece dinamicamente */}
        { mostrarSeccionDinamica && (
        <div>
          <div className="row">
            <p className="text-sans-p mt-4">Luego agrega los profesionales que correspondan a este estamento:</p>
          </div>

          <div className="row">
            <div className="col-1"> <p className="text-sans-p-bold mt-3">N°</p> </div>
            <div className="col"> <p className="text-sans-p-bold mt-3">Calidad jurídica</p> </div>
            <div className="col"> <p className="text-sans-p-bold mt-3">Renta bruta mensual</p> </div>
            <div className="col"> <p className="text-sans-p-bold mt-3">Grado <br/> (Si corresponde)</p> </div>
            <div className="col"> <p className="text-sans-p-bold mt-3">Acción</p> </div>
          </div>

          {personas.map((persona) => (
            <div 
            key={persona.id} 
            className={`row py-3 ${persona.id % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>
              <div className="col-1"> <p className="text-sans-p-bold mt-3">{persona.id}</p> </div>
              <div className="col">
                <DropdownSelect 
                placeholder="Calidad jurídica"
                options={[]}
                onSelectionChange={() => {
                  // Mostrar la sección dinámica al hacer una selección
                  setMostrarSeccionDinamica(true);
                }}/>
              </div>
              {/* ajustar segun estilos creados por Vero para campos de input en 5.2 */}
              <div className="col pt-3"> <input></input> </div>
              <div className="col pt-3"> <input></input> </div>
              <div className="col">
                {personas.length > 1 && (
                <button
                  className="btn-terciario-ghost"
                  onClick={() => eliminarPersona(persona.id)}
                >
                  <i className="material-symbols-rounded me-2">delete</i>
                  <p className="mb-0 text-decoration-underline">Borrar</p>
                </button> 
                )}
              </div>
            </div>
          ))}
          <button
            className="btn-secundario-s m-2"
            onClick={agregarPersona}
          >
            <i className="material-symbols-rounded me-2">add</i>
            <p className="mb-0 text-decoration-underline">Agregar {estamento ? estamento.label : 'Ninguna'}</p>
          </button>
        </div>
        )}
      </div> 
    </div>
  )
}

export default Personal;