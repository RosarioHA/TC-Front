import { useState } from "react";
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
   }) => {

  const [estamentosPindirecto, setEstamentosPindirecto] = useState([{ id: 1 }]);


  const itemsInformados = [
    { label: '01 - Personal de Planta', value: paso5.sub21_total_personal_planta },
    { label: '02 - Personal de Contrata', value: paso5.sub21_total_personal_contrata },
    { label: '03 - Otras Remuneraciones', value: paso5.sub21_total_otras_remuneraciones },
    { label: '04 - Otros Gastos en Personal', value: paso5.sub21_total_gastos_en_personal },
  ];

  // Filtrar los items que tienen valor 0
  const ItemsInformadosFiltrados = itemsInformados.filter(item => Number(item.value) !== 0);

  // Verificar si hay items para mostrar
  if (ItemsInformadosFiltrados.length === 0) {
    return <p>No hay Gastos en Personal asociados</p>;
  }

  const itemsJustificados = [
    { label: '01 - Personal de Planta', informado: paso5.sub21_total_personal_planta, justificado: paso5.sub21_personal_planta_justificado, por_justificar: paso5.sub21_personal_planta_justificar },
    { label: '02 - Personal de Contrata', informado: paso5.sub21_total_personal_contrata, justificado: paso5.sub21_personal_contrata_justificado, por_justificar: paso5.sub21_personal_contrata_justificar },
    { label: '03 - Otras Remuneraciones', informado: paso5.sub21_total_otras_remuneraciones, justificado: paso5.sub21_otras_remuneraciones_justificado, por_justificar: paso5.sub21_otras_remuneraciones_justificar },
    { label: '04 - Otros Gastos en Personal', informado: paso5.sub21_total_gastos_en_personal, justificado: paso5.sub21_gastos_en_personal_justificado, por_justificar: paso5.sub21_gastos_en_personal_justificar },
  ];

  // Función de utilidad para formatear números
  const formatearNumero = (numero) => {
    // Asegurarse de que el valor es un número. Convertir si es necesario.
    const valorNumerico = Number(numero);
    // Verificar si el valor es un número válido antes de intentar formatearlo
    if (!isNaN(valorNumerico)) {
      return valorNumerico.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    // Devolver un valor predeterminado o el mismo valor si no es un número
    return numero;
  };


  // Filtrar los items que tienen valor 0
  const itemsJustificadosFiltrados = itemsJustificados.filter(item => Number(item.informado) !== 0);

  // Verificar si hay items para mostrar
  if (itemsJustificadosFiltrados.length === 0) {
    return <p>No hay Gastos en Personal asociados</p>;
  }

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

      <div className="my-4 relative-container">
        <p className="text-sans-p-bold">Estos son los costos en personal (subtítulo 21) que declaraste en el punto 5.1:</p>
        <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% de los recursos declarados en la rentas del personal para completar esta sección.</h6>
        <div className="ps-3 my-4">
          {/* Encabezado */}
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="col-1">
              <p className="text-sans-p-bold mb-0 mt-1">#</p>
            </div>
            <div className="col-3">
              <p className="text-sans-p-bold mb-0 mt-1">Ítem</p>
            </div>
            <div className="col-6">
              <p className="text-sans-p-bold mb-0 mt-1">Costo informado por el sector ($M)</p>
            </div>
          </div>
          {/* Items */}
          {ItemsInformadosFiltrados.map((item, index) => (
            <div
              key={index}
              className={`row ${index % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
              <div className="d-flex justify-content-between py-3 fw-bold">
                <div className="col-1">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-4">{index + 1}</p>
                </div>
                <div className="col-3">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-5">{item.label}</p>
                </div>
                <div className="col-6">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(item.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 relative-container">
        <PersonalDirecto
          id={id}
          paso5={paso5}
          solo_lectura={solo_lectura}
          stepNumber={stepNumber}
          data_personal_directo={data_personal_directo}
          listado_estamentos={listado_estamentos}
          listado_calidades_juridicas={listado_calidades_juridicas_directas}
        />
      </div>

      <div className="my-4 relative-container">
        <p className="text-sans-p-bold">Resumen de justificación de costos de personal directo y de soporte:</p>
        <h6 className="text-sans-h6-primary mt-3">Debes justificar el 100% del costo informado en el punto 5.1 para completar esta sección.</h6>
        <div className="ps-3 my-4">
          {/* Encabezado */}
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="col-1">
              <p className="text-sans-p-bold mb-0 mt-1">#</p>
            </div>
            <div className="col-3">
              <p className="text-sans-p-bold mb-0 mt-1">Ítems informados subtítulo 21</p>
            </div>
            <div className="col-2">
              <p className="text-sans-p-bold mb-0 mt-1">Costo informado ($M)</p>
            </div>
            <div className="col-2 d-flex">
              <p className="text-sans-p-bold mb-0 mt-1">Costo justificado ($M)</p>
            </div>
            <div className="col-2 d-flex">
              <p className="text-sans-p-bold mb-0 mt-1">Diferencia por justificar ($M)</p>
            </div>
          </div>
          {/* Items */}
          {itemsJustificadosFiltrados.map((item, index) => (
            <div
              key={index}
              className={`row ${index % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
              <div className="d-flex justify-content-between py-3 fw-bold">
                <div className="col-1">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-4">{index + 1}</p>
                </div>
                <div className="col-3">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-4">{item.label}</p>
                </div>
                <div className="col-2">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(item.informado)}</p>
                </div>
                <div className="col-2">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(item.justificado)}</p>
                </div>
                <div className="col-2">
                  <p className="text-sans-p-bold mb-0 mt-3 ms-5">{formatearNumero(item.por_justificar)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
