import { useState, useEffect, useContext } from "react";
import DropdownSelect from "../dropdown/select";
import CustomTextarea from "../forms/custom_textarea";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormularioContext } from "../../context/FormSectorial";

const PersonalIndirecto = ({
  id,
  paso5,
  solo_lectura,
  stepNumber,
  data_personal_indirecto,
  listado_estamentos,
  listado_calidades_juridicas
}) => {
  const [personas, setPersonas] = useState({});
  const [seleccionCalidadJuridica, setSeleccionCalidadJuridica] = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [estamento, setEstamento] = useState(null);
  const [mostrarSeccionDinamica, setMostrarSeccionDinamica] = useState(false);
  const [opcionesEstamentos, setOpcionesEstamentos] = useState([]);
  const [opcionesCalidadJuridica, setOpcionesCalidadJuridica] = useState([]);

  /*useEffect(() => {
   const esquema = construirValidacionPaso5_1ab(costosIndirectos);
   setEsquemaValidacion(esquema);
 }, [costosIndirectos]);*/

  const { control, handleSubmit, trigger, clearErrors, setError, formState: { errors } } = useForm({
    //resolver: esquemaValidacion ? yupResolver(esquemaValidacion) : undefined,
    mode: 'onBlur',
  });

  //convertir estructura para el select
  const transformarEnOpciones = (datos, propiedadLabel) => {
    return datos.map(dato => ({
      label: dato[propiedadLabel], // Usar dinámicamente la propiedad para 'label'
      value: dato.id.toString()
    }));
  };

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

  // Función para agrupar los datos por calidad juridica
  const agruparPorCalidadJuridica = (datos) => {
    const agrupados = datos.reduce((acc, item) => {
      const displayKey = item.nombre_calidad_juridica;
      acc[displayKey] = acc[displayKey] || [];
      acc[displayKey].push(item);
      return acc;
    }, {});

    setPersonas(agrupados);
  };

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() => {
    agruparPorCalidadJuridica(data_personal_indirecto);
  }, [data_personal_indirecto]);

  // Función para manejar la adición de una nueva calidad jurídica
  useEffect(() => {
    const calidadesConPersonas = Object.keys(personas);
    const calidadesSinPersonas = listado_calidades_juridicas.filter(({ calidad_juridica }) => 
      !calidadesConPersonas.includes(calidad_juridica)
    ).map(({ id, calidad_juridica }) => ({
      label: calidad_juridica,
      value: id.toString()
    }));

    setOpcionesCalidadJuridica(calidadesSinPersonas);
    setMostrarSelector(calidadesSinPersonas.length > 0);
  }, [personas, listado_calidades_juridicas]);


  const agregarPersona = (calidadJuridicaId) => {
    const nuevaPersona = {
      id: Math.floor(Date.now() / 1000),
      calidad_juridica: calidadJuridicaId,
      estamento: [],
      renta_bruta: null,
      grado: null
    };
  
    setPersonas(prevPersonas => {
      const calidadJuridicaNombre = listado_calidades_juridicas.find(({ id }) => id.toString() === calidadJuridicaId)?.calidad_juridica;
      if (!calidadJuridicaNombre) return prevPersonas;
  
      const nuevasPersonas = { ...prevPersonas };
      if (nuevasPersonas[calidadJuridicaNombre]) {
        nuevasPersonas[calidadJuridicaNombre].push(nuevaPersona);
      } else {
        nuevasPersonas[calidadJuridicaNombre] = [nuevaPersona];
      }
      return nuevasPersonas;
    });
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

      {mostrarSelector && (
        <div className="row">
          <div className="col-1">
            <p className="text-sans-p-bold mt-3">Calidad Jurídica</p>
          </div>
          <div className="col-2">
            <DropdownSelect
              placeholder="Calidad Jurídica"
              options={opcionesCalidadJuridica}
              onSelectionChange={(selectedOption) => {
                setEstamento(selectedOption);
                // No necesitas cambiar mostrarSeccionDinamica aquí.
              }} />
          </div>
        </div>
        )}

        {/* Renderiza automáticamente basado en la presencia de datos en personas */}
        {Object.keys(personas).length > 0 && Object.keys(personas).map((key) => (
          <div key={key}>
            <p className="text-sans-p-bold mt-3">Calidad Jurídica</p><p>{key}</p>
            {/* Encabezado para cada grupo */}
            <div className="row">
              <div className="col-1"> <p className="text-sans-p-bold">N°</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Estamento</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Renta bruta mensual</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Grado <br /> (Si corresponde)</p> </div>
              <div className="col"> <p className="text-sans-p-bold">Acción</p> </div>
            </div>
            {Array.isArray(personas[key]) ? personas[key].map((persona, index) => (
              <div
                key={persona.id}
                className={`row py-3 ${index % 2 === 0 ? 'white-line' : 'neutral-line'} align-items-center me-3`}>

                <div className="col-1"> <p className="text-sans-p-bold mt-3">{index + 1}</p> </div>
                <div className="col">
                  <p className="text-sans-p-bold mt-3">{persona.nombre_estamento}</p>
                </div>
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center" defaultValue={persona.renta_bruta} />
                </div>
                <div className="col pt-3">
                  <input className="form-control mx-auto px-0 mb-2 text-center" defaultValue={persona.grado} />
                </div>
                <div className="col">
                  <button
                    className="btn-terciario-ghost"
                    onClick={() => eliminarPersona(persona.id, key)}
                  >
                    <i className="material-symbols-rounded me-2">delete</i>
                    <p className="mb-0 text-decoration-underline">Borrar</p>
                  </button>
                </div>
              </div>
            )) : null}
            <button
              className="btn-secundario-s m-2"
              onClick={() => agregarPersona(key)}
            >
              <i className="material-symbols-rounded me-2">add</i>
              <p className="mb-0 text-decoration-underline">Agregar a {key}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );


};

export default PersonalIndirecto;