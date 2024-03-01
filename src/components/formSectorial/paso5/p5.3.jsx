import { useEffect, useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import PersonalIndirecto from "../../tables/PersonalIndirecto";
import PersonalDirecto from "../../tables/PersonalDirecto";

export const Subpaso_CincoPuntoTres = (
  { id,
    paso5,
    solo_lectura,
    stepNumber,
    data_personal_directo,
    data_personal_indirecto,
    listado_estamentos,
    listado_calidades_juridicas_directas,
    listado_calidades_juridicas_indirectas,
    refetchTrigger
   }) => {

  const [estamentosPindirecto, setEstamentosPindirecto] = useState([{ id: 1 }]);


  const agregarCalJuridicaPindirecto = () => {
    const nuevoEstamento = { id: estamentosPindirecto.length + 1 };
    setEstamentosPindirecto([...estamentosPindirecto, nuevoEstamento]);
  };
  const eliminarCalJuridicaPindirecto = (id) => {
    const estamentosActualizados = estamentosPindirecto.filter(
      (proc) => proc.id !== id
    );
    setEstamentosPindirecto(estamentosActualizados);
  };


  return (
    <div className="my-4">
      <h4 className="text-sans-h4">5.3 Cálculo de personal asociado al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">El objetivo de este apartado es cuantificar el personal necesario para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.</h6>

      {/* a.Personal directo */}

      <p className="text-sans-m-semibold mt-4">a. Personal que ejerce directamente la competencia</p>
      <h6 className="text-sans-h6-primary mt-3">Por ejercicio directo se entenderán todas aquellas tareas y procedimientos específicos y exclusivos de la competencia. En la renta bruta se deben considerar aquellas asignaciones propias del cargo. </h6>

      <div className="my-4 relative-container">
        <PersonalDirecto
          id={id}
          paso5={paso5}
          solo_lectura={solo_lectura}
          stepNumber={stepNumber}
          data_personal_directo={data_personal_directo}
          listado_estamentos={listado_estamentos}
          listado_calidades_juridicas={listado_calidades_juridicas_directas}
          refetchTrigger={refetchTrigger}
        />
      </div>

      {/* b.Personal de soporte */}

      <p className="text-sans-m-semibold mt-4">b. Personal de soporte</p>
      <h6 className="text-sans-h6-primary mt-3">Por personal de soporte se entenderán todas personas que realizan tareas y procedimientos indirectos a la competencia. </h6>

      {estamentosPindirecto.map((calidadJuridica) => (
        <div key={calidadJuridica.id}>
          {estamentosPindirecto.length > 1 && !solo_lectura && (
            <div className="absolute-container">
              <button
                type="button"
                className="btn-terciario-ghost"
                onClick={() => eliminarCalJuridicaPindirecto(calidadJuridica.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar Calidad Jurídica</p>
              </button>
            </div>
          )}
          <div className="my-4 relative-container">
            <PersonalIndirecto
              id={id}
              paso5={paso5}
              solo_lectura={solo_lectura}
              stepNumber={stepNumber}
              data_personal_indirecto={data_personal_indirecto}
              listado_estamentos={listado_estamentos}
              listado_calidades_juridicas={listado_calidades_juridicas_indirectas}
            />
          </div>
        </div>
      ))}
      {!solo_lectura && (
      <button
        className="btn-secundario-s m-2"
        onClick={agregarCalJuridicaPindirecto}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Calidad Jurídica</p>
      </button>
      )}
      
      <div className="mt-5 border-bottom pb-4">
        <CustomTextarea 
        label="Descripción de funciones"
        placeholder="Describe las funciones asociadas a otras competencias"
        maxLength={1100}/>
        <div className="d-flex text-sans-h6-primary">
          <i className="material-symbols-rounded me-2">info</i>
          <h6>En el caso de que los/as funcionarios/as identificados/as realicen funciones asociadas a otras competencias, describa brevemente sus características, y si existe relación entre ellas y el ejercicio de la competencia en estudio.</h6>
        </div>
      </div>

    </div>
  )
};
