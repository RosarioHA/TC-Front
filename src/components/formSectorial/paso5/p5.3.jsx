import PersonalSectorial from "../../tables/PersonalSector";

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
  }) =>
{
  
  const personalPendienteDirecto = paso5?.[0].personal_directo_pendiente; 
  const personalPendienteIndirecto = paso5?.[0].personal_directo_pendiente; 
  console.log('d',personalPendienteDirecto )
  console.log('i',personalPendienteIndirecto )
  return (
    <div className="my-4">
      <h4 className="text-sans-h4">5.3 Cálculo de personal asociado al ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary mt-3">El objetivo de este apartado es cuantificar el personal necesario
        para realizar los procedimientos y tareas identificadas en el paso 2, Arquitectura de Procesos.</h6>

      {/* a.Personal directo */}

      <p className="text-sans-m-semibold mt-4">a. Personal que ejerce directamente la competencia</p>
      <h6 className="text-sans-h6-primary mt-3">Por ejercicio directo se entenderán todas aquellas tareas y procedimientos
        específicos y exclusivos de la competencia. En la renta bruta se deben considerar aquellas asignaciones propias del cargo. </h6>
      <>
        <p className="text-sans-p-bold mt-4">Estos son los costos en personal (subtítulo 21) que declaraste en el punto 5.1a:</p>
        <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% de los recursos declarados en las rentas del personal para completar esta sección.</h6>
        <h6 className="text-sans-h6-primary mt-3">Te recordamos que estos son los subtítulos para los que debes justificar personal:</h6>
        <div className="d-flex ">
        {personalPendienteDirecto.map((item,index)=>(
        <div key={index} className="badge-info mx-2 my-2">{item}</div>))}
        </div>
      </>

      <div className="my-4 relative-container">
        <PersonalSectorial
          id={id}
          paso5={paso5}
          solo_lectura={solo_lectura}
          stepNumber={stepNumber}
          data_personal={data_personal_directo}
          listado_estamentos={listado_estamentos}
          listado_calidades_juridicas={listado_calidades_juridicas_directas}
          region={region}
          prefix="sub21"
          payloadModel="p_5_3_a_personal_directo"
          descripcionModelo="directo"
          personalPendiente={personalPendienteDirecto}
        />
      </div>

      {/* b.Personal de soporte */}

      <p className="text-sans-m-semibold mt-4">b. Personal de soporte</p>
      <h6 className="text-sans-h6-primary mt-3">Por personal de soporte se entenderán todas personas que realizan tareas y procedimientos indirectos a la competencia. </h6>
      <>
        <p className="text-sans-p-bold mt-4">Estos son los costos en personal (subtítulo 21) que declaraste en el punto 5.1b:</p>
        <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% de los recursos declarados en las rentas del personal para completar esta sección.</h6>
        <h6 className="text-sans-h6-primary mt-3">Te recordamos que estos son los subtítulos para los que debes justificar personal:</h6>
        <div className="d-flex ">
        
        {personalPendienteIndirecto.map((item,index)=>(
        <div key={index} className="badge-info mx-2 my-2">{item}</div>))}
        </div>
      </>
      <div className="my-4 relative-container">
        <PersonalSectorial
          id={id}
          paso5={paso5}
          solo_lectura={solo_lectura}
          stepNumber={stepNumber}
          data_personal={data_personal_indirecto}
          listado_estamentos={listado_estamentos}
          listado_calidades_juridicas={listado_calidades_juridicas_indirectas}
          region={region}
          prefix="sub21b"
          payloadModel="p_5_3_b_personal_indirecto"
          descripcionModelo="indirecto"
          personalPendiente={personalPendienteIndirecto}
        />
      </div>

    </div>
  )
};
