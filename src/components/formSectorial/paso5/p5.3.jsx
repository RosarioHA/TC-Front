import PersonalIndirecto from "../../tables/PersonalIndirectoSector";
import PersonalDirecto from "../../tables/PersonalDirectoSector";

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
    region
  }) => {


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
          region={region}
          
        />
      </div>

      {/* b.Personal de soporte */}

      <p className="text-sans-m-semibold mt-4">b. Personal de soporte</p>
      <h6 className="text-sans-h6-primary mt-3">Por personal de soporte se entenderán todas personas que realizan tareas y procedimientos indirectos a la competencia. </h6>

      <div className="my-4 relative-container">
        <PersonalIndirecto
          id={id}
          paso5={paso5}
          solo_lectura={solo_lectura}
          stepNumber={stepNumber}
          data_personal_indirecto={data_personal_indirecto}
          listado_estamentos={listado_estamentos}
          listado_calidades_juridicas={listado_calidades_juridicas_indirectas}
          region={region}
        />
      </div>

    </div>
  )
};
