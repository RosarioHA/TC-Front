import { useState, useEffect, useContext } from "react";
import { FormularioContext } from "../../../context/FormSectorial";
import { apiTransferenciaCompentencia } from "../../../services/transferenciaCompetencia";
import CustomInput from "../../forms/custom_input";
import CustomTextarea from "../../forms/custom_textarea";
import DropdownSelect from "../../dropdown/select";
import { RadioButtons } from "../../forms/radio_btns";

export const Subpaso_dosPuntoCuatro = ({
  id,
  data,
  stepNumber,
  listado_etapas,
  setRefreshSubpasoDos_tres,
  refreshSubpasoDos_cuatro,
}) => {

  // Lógica para recargar opciones de etapa cuando se crean o eliminan en paso 2.3
  const [ dataDirecta, setDataDirecta ] = useState(null);
  const [ opcionesEtapas, setOpcionesEtapas ] = useState([]);
  
  // Llamada para recargar componente
  const fetchDataDirecta = async () => {
    try {
      const response = await apiTransferenciaCompentencia.get(`/formulario-sectorial/${id}/paso-${stepNumber}/`);
      setDataDirecta(response.data);
    } catch (error) {
      console.error('Error al obtener datos directamente:', error);
    }
  };

  //convertir estructura para el select
  const transformarEnOpciones = (datos) => {
    return datos.map(dato => ({
      label: dato.nombre_etapa,
      value: dato.id.toString() // Convertimos el ID a string para mantener consistencia
    }));
  };

  useEffect(() => {
    if (refreshSubpasoDos_cuatro) {
      fetchDataDirecta();
      setRefreshSubpasoDos_tres(false);
    }
  }, [refreshSubpasoDos_cuatro, setRefreshSubpasoDos_tres, id, stepNumber]);
  
  // Efecto para manejar la actualización de opciones basado en dataDirecta
  useEffect(() => {
    if (dataDirecta?.listado_unidades) {
      const nuevasOpciones = transformarEnOpciones(dataDirecta.listado_unidades);
      setOpcionesEtapas(nuevasOpciones);
    }
  }, [dataDirecta]);
  
  // Efecto para manejar la carga inicial de opciones
  useEffect(() => {
    if (listado_etapas) {
      const listaInicial = transformarEnOpciones(listado_etapas);
      setOpcionesEtapas(listaInicial);
    }
  }, [listado_etapas]);

  const [nuevaUnidadId, setNuevaUnidadId] = useState('');

  const manejarCambioDropdown = (opcionSeleccionada) => {
    const idSeleccionado = opcionSeleccionada.value;
    setNuevaUnidadId(idSeleccionado);
  };

  const { handleUpdatePaso } = useContext(FormularioContext);
  const [plataformasySoftwares, setPlataformasySoftwares] = useState(data);

  // Lógica para agregar una nueva tabla Plataformas
  // Generador de ID único
  const generarIdUnico = () => {
    // Implementa tu lógica para generar un ID único
    return Math.floor(Date.now() / 1000);
  };

  const [ultimaPlataformaId, setUltimaPlataformaId] = useState(null);
  const [mostrarBotonGuardarEtapa, setMostrarBotonGuardarEtapa] = useState(false);

  const agregarPlataforma = () => {
    const nuevaEtapaId = generarIdUnico();
    setUltimaPlataformaId(nuevaEtapaId);
    const nuevaEtapa = {
      id: nuevaEtapaId,
      nombre_etapa: '',
      descripcion_etapa: '',
      procedimientos: [],
      editando: false
    };
    setPlataformasySoftwares(prevEtapas => [...prevEtapas, nuevaEtapa]);
    setMostrarBotonGuardarEtapa(true);
  };

  // Lógica para eliminar una fila de un organismo
  const eliminarElemento = async (plataformaId) => {
    
      // Preparar payload para eliminar una etapa
        const payload = {
          'p_2_4_plataformas_y_softwares': [{
            id: plataformaId,
            DELETE: true
          }]
        };
        
      // Actualizar el estado local para reflejar la eliminación
      setPlataformasySoftwares(prevPlataformas => prevPlataformas.filter(plataforma => plataforma.id !== plataformaId));

      // Llamar a la API para actualizar los datos
      try {
        await handleUpdatePaso(id, stepNumber, payload);

      setMostrarBotonGuardarEtapa(false);
      setRefreshSubpasoDos_cuatro(true);

      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  

  // Lógica para editar sectores existentes
  // Actualiza el estado cuando los campos cambian

  const [plataformaEnEdicionId, setPlataformaEnEdicionId] = useState(null);
  

  const handleInputChange = (plataformaId, campo, valor) => {
    setPlataformaEnEdicionId(plataformaId);

    setPlataformasySoftwares(prevPlataformas => prevPlataformas.map(plataforma => {
      if (plataforma.id === plataformaId) {
          // Actualizar una plataforma específica
          return { ...plataforma, [campo]: valor };
      }
      return plataforma;
    }));
  };
  
  
  const handleSave = async (plataformaId, esGuardadoPorBlur) => {
    if (!esGuardadoPorBlur) {
      setMostrarBotonGuardarEtapa(false);
    }

    const plataforma = plataformasySoftwares.find(e => e.id === plataformaId);
    let payload;
  
      // Preparar payload para guardar una etapa
      payload = {
        'p_2_4_plataformas_y_softwares': [{
          id: plataformaId,
          nombre_plataforma: plataforma.nombre_plataforma,
          descripcion_tecnica: plataforma.descripcion_tecnica
        }]
      };
    
  
    try {
      // Llamar a la API para actualizar los datos
      const response = await handleUpdatePaso(id, stepNumber, payload);
      // Más código para manejar la respuesta

    setMostrarBotonGuardarEtapa(false);
    setRefreshSubpasoDos_cuatro(true);

    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };


    return(
      <div>
        <h4 className="text-sans-h4">2.4 Plataformas y softwares utilizados en el ejercicio de la competencia</h4>
        <h6 className="text-sans-h6-primary">Identifica las plataformas y/o softwares utilizados en el ejercicio de la competencia y llena una ficha técnica para cada plataforma o software.</h6>

        {/* Renderiza las tablas para cada plataforma */}
        <div className="col border">
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2">Nombre de Plataforma o Sofware</p>
            </div>
            <div className="col ms-5">
              <CustomInput 
              placeholder="Escribe el nombre de la plataforma o software"
              maxLength={500}/>
            </div>
          </div>

          <hr/>
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
            </div>
            <div className="col ms-5">
              <CustomInput 
              placeholder="Indique la versión y una descripción técnica del software o plataforma"
              maxLength={500}/>
            </div>
          </div>

          <hr/>
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2">Descripción técnica y versiones</p>
            </div>
            <div className="col ms-5">
              <div className="row d-flex">
                <div className="col">
                <CustomInput 
                label="Costo de adquisición"
                placeholder="Costo de adquisión M$"
                />
                <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                </div>
                <div className="col">
                <CustomInput 
                label="Costo de Mantención Anual"
                placeholder="Costo de mantención M$"
                />
                <h6 className="text-sans-h6 text-end">Campo númerico en miles de pesos.</h6>
                </div>
              </div>
              <div className="row mt-4">
                <CustomTextarea 
                label="Descripción de costos"
                placeholder="Describe los costos de la plataforma o software"
                maxLength={500}/>
              </div>
            </div>
          </div>
          
          <hr/>
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2">Función en el ejercicio de la competencia identificando perfiles de usuario</p>
            </div>
            <div className="col ms-5">
              <CustomTextarea 
              placeholder="Describe la función en el ejercicio de la competencia y los perfiles de usuario."
              maxLength={500}/>
            </div>
          </div>

          <hr/>
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2 mb-0">Etapas donde se utiliza</p>
              <p className="text-sans-p ms-2">(Opcional)</p>
            </div>
            <div className="col ms-5">
              <DropdownSelect
              placeholder="Etapa"
              options=""/>
            </div>
          </div>

          <hr/>
          <div className="row p-3">
            <div className="col-2"> 
              <p className="text-sans-p-bold ms-2 mb-0">¿El uso de la plataforma o software requirió capacitación?</p>
            </div>
            <div className="col ms-5">
              <RadioButtons
              altA="Si"
              altB="No"/>
            </div>
          </div> 
        </div>
  
        

      </div>
    )
  };