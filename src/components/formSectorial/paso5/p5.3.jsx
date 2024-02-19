import { useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import Personal from "../../tables/Personal";
import PersonalDirecto from "../../tables/PersonalDirecto";

export const Subpaso_CincoPuntoTres = (
  {id,
  paso5,
  formulario_enviado,
  stepNumber,
  data_personal_directo,
  data_personal_indirecto,
  listado_estamentos,
  listado_calidades_juridicas}
) => {

 

  
  const [estamentosPindirecto, setEstamentosPindirecto] = useState([{ id: 1 }]);


  const agregarEstamentoPindirecto = () => {
    const nuevoEstamento = { id: estamentosPindirecto.length + 1 };
    setEstamentosPindirecto([...estamentosPindirecto, nuevoEstamento]);
  };
  const eliminarEstamentoPindirecto = (id) => {
    const estamentosActualizados = estamentosPindirecto.filter(
      (proc) => proc.id !== id
    );
    setEstamentosPindirecto(estamentosActualizados);
  };

  return (
    <div className="my-4">
      <h4 className="text-sans-h4">5.3 Cálculo de personal asociado al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.</h6>

      <div className="my-4 relative-container">
            <PersonalDirecto 
              id={id}
              paso5={paso5}
              formulario_enviado={formulario_enviado}
              stepNumber={stepNumber}
              data_personal_directo={data_personal_directo}
              listado_estamentos={listado_estamentos}
              listado_calidades_juridicas={listado_calidades_juridicas}
            />
          </div>
      
      <p className="text-sans-m-semibold mt-4">b. Personal de soporte</p>
      <h6 className="text-sans-h6-primary mt-3">Por personal de soporte se entenderán todas personas que realizan tareas y procedimientos indirectos a la competencia. </h6>

      {estamentosPindirecto.map((estamento) => (
        <div key={estamento.id}>
          {estamentosPindirecto.length > 1 && (
            <div className="absolute-container">
              <button
                type="button"
                className="btn-terciario-ghost"
                onClick={() => eliminarEstamentoPindirecto(estamento.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar estamento</p>
              </button>
            </div>
          )}
          <div className="my-4 relative-container">
            <Personal />
          </div>
        </div>
      ))}

      <button
        className="btn-secundario-s m-2"
        onClick={agregarEstamentoPindirecto}
      >
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Estamento</p>
      </button>

      <div className="mt-5">
        <CustomTextarea
          label="Descripción de funciones"
          placeholder="Describe las funciones asociadas a otras competencias"
          maxLength={1100} />
        <div className="d-flex text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6>En el caso de que los/as funcionarios/as identificados/as realicen funciones asociadas a otras competencias, describa brevemente sus características, y si existe relación entre ellas y el ejercicio de la competencia en estudio.</h6>
        </div>
      </div>

    </div>
  )
}
