import { useState, useEffect } from "react";
import DropdownSelect from "../dropdown/select";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const PersonalDirecto = ({
  id,
  paso5,
  formulario_enviado,
  stepNumber,
  data_personal_directo,
  listado_estamentos,
  listado_calidades_juridicas
}) => {

  const [personas, setPersonas] = useState([]);
  const [estamentosPdirecto, setEstamentosPdirecto] = useState([{ id: 1 }]);
  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);
  const [opcionesCalidadJuridica, setOpcionesCalidadJuridica] = useState([]);
  const [estamento, setEstamento] = useState(null);
  const [mostrarSeccionDinamica, setMostrarSeccionDinamica] = useState(false);


  /*useEffect(() => {
    const esquema = construirValidacionPaso5_1ab(costosIndirectos);
    setEsquemaValidacion(esquema);
  }, [costosIndirectos]);*/

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    //resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  // Función para agrupar los datos por organismo_display
  const agruparPorEstamento = (datos) => {
    const agrupados = datos.reduce((acc, item) => {
      const displayKey = item.nombre_estamento;
      acc[displayKey] = acc[displayKey] || [];
      acc[displayKey].push(item);
      return acc;
    }, {});

    setPersonas(agrupados);
  };

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() => {
    agruparPorEstamento(data_personal_directo);
  }, [data_personal_directo]);

  console.log('personas', personas)


  const agregarEstamentoPdirecto = () => {
    const nuevoEstamento = { id: estamentosPdirecto.length + 1 };
    setEstamentosPdirecto([...estamentosPdirecto, nuevoEstamento]);
  };
  const eliminarEstamentoPdirecto = (id) => {
    const estamentosActualizados = estamentosPdirecto.filter(
      (proc) => proc.id !== id
    );
    setEstamentosPdirecto(estamentosActualizados);
  };

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map(dato => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString()
    }));
  };

  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_estamentos) {
      const opcionesDeEstamentos = transformarEnOpciones(listado_estamentos, 'estamento');
      setOpcionesEstamentos(opcionesDeEstamentos);
    }
  }, [listado_estamentos]);

  useEffect(() => {
    if (listado_calidades_juridicas) {
      const opcionesDeCalidadJuridica = transformarEnOpciones(listado_calidades_juridicas, 'calidad_juridica');
      setOpcionesCalidadJuridica(opcionesDeCalidadJuridica);
    }
  }, [listado_calidades_juridicas]);

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

      <p className="text-sans-m-semibold mt-4">a. Personal que ejerce directamente la competencia</p>
      <h6 className="text-sans-h6-primary mt-3">Por ejercicio directo se entenderán todas aquellas tareas y procedimientos específicos y exclusivos de la competencia. En la renta bruta se deben considerar aquellas asignaciones propias del cargo. </h6>

      {Object.entries(personas).map(([ nombre_estamento, filas ], index) => (
        <div key={nombre_estamento}>
          {nombre_estamento.length > 1 && (
            <div className="d-flex justify-content-end absolute-container">
              <button
                type="button"
                className="btn-terciario-ghost "
                onClick={() => eliminarEstamentoPdirecto(estamento.id)}
              >
                <i className="material-symbols-rounded me-2">delete</i>
                <p className="mb-0 text-decoration-underline">Borrar estamento</p>
              </button>
            </div>
          )}
        

      <div className="col my-4">
        <div className="row">
          <div className="col-1">
            <p className="text-sans-p-bold mt-3">Estamento</p>
          </div>
          <div className="col-2">
            <Controller
              control={control}
              name={`estamento`}
              render={() => {
                return (
                  <DropdownSelect
                    id={`estamento`}
                    value={nombre_estamento}
                    name={`estamento`}
                    placeholder="Estamento"
                    options={opcionesEstamentos}
                    onSelectionChange={(selectedOption) => {
                      setEstamento(selectedOption);
                      setMostrarSeccionDinamica(true);
                    }}

                    readOnly={formulario_enviado}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* aparece dinamicamente */}
        {mostrarSeccionDinamica && (
          <div>
            <div className="row">
              <p className="text-sans-p mt-4">Luego agrega los profesionales que correspondan a este estamento:</p>
            </div>

            <div className="row">
              <div className="col-1"> <p className="text-sans-p-bold mt-3">N°</p> </div>
              <div className="col"> <p className="text-sans-p-bold mt-3">Calidad jurídica</p> </div>
              <div className="col"> <p className="text-sans-p-bold mt-3">Renta bruta mensual</p> </div>
              <div className="col"> <p className="text-sans-p-bold mt-3">Grado <br /> (Si corresponde)</p> </div>
              <div className="col"> <p className="text-sans-p-bold mt-3">Acción</p> </div>
            </div>

            {filas.map((persona, personaIndex) => (
              <div
                key={persona.id}
                className={`row py-3 ${persona.id % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>
                <div className="col-1"> <p className="text-sans-p-bold mt-3">{persona.id}</p> </div>
                <div className="col">
                  <DropdownSelect
                    placeholder="Calidad jurídica"
                    options={opcionesCalidadJuridica}
                    onSelectionChange={() => {
                      // Mostrar la sección dinámica al hacer una selección
                      setMostrarSeccionDinamica(true);
                    }} />
                </div>
                {/* ajustar segun estilos creados por Vero para campos de input en 5.2 */}
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center"></input>
                </div>
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center"></input>
                </div>
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
      ))};

      <button
        className="btn-secundario-s m-2"
        onClick={agregarEstamentoPdirecto}
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

export default PersonalDirecto;