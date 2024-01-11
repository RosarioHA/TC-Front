import React, {useState, useEffect, useContext} from "react";
import CustomInput from "../../forms/custom_input_prueba";
import { FormularioContext } from "../../../context/FormSectorial";

export const Subpaso_dosPuntoDos = ({id, data, stepNumber}) => {

  const {  refreshSubpasoDos, setRefreshSubpasoDos, recargarDatos } = useContext(FormularioContext);


  // Definición de la función 'agrupadosPorOrganismo'
  const agrupadosPorOrganismo = () => {
    return data.reduce((acc, unidad) => {
      const { organismo_display, nombre_ministerio_servicio } = unidad.organismo;
      if (!acc[organismo_display]) {
        acc[organismo_display] = {};
      }
      if (!acc[organismo_display][nombre_ministerio_servicio]) {
        acc[organismo_display][nombre_ministerio_servicio] = [];
      }
      acc[organismo_display][nombre_ministerio_servicio].push(unidad);
      return acc;
    }, {});
  };

  const [agrupados, setAgrupados] = useState({});

  useEffect(() => {
    if (refreshSubpasoDos) {
      console.log('Recibida la instrucción desde Paso 1:', refreshSubpasoDos);

      const nuevosAgrupados = agrupadosPorOrganismo();
      setAgrupados(nuevosAgrupados); // Actualiza el estado con los nuevos agrupados

      recargarDatos();

      setRefreshSubpasoDos(false); // Reestablece el estado de refresco
      console.log('Estado final Refresh:', refreshSubpasoDos);
    }
  }, [refreshSubpasoDos, setRefreshSubpasoDos, recargarDatos]); // Asegúrate de que 'data' esté en las dependencias

  
    return(
      <div>
        <h4 className="text-sans-h4">2.2 Unidades intervinientes en el Ministerio o Servicio</h4>
        <h6 className="text-sans-h6-primary">Se entenderá por Unidad Interviniente a aquellos actores al interior de la orgánica sectorial que intervienen en el ejercicio de la competencia analizada.</h6> 
        <h6 className="text-sans-h6-primary mt-3">  Asegúrate de identificar correctamente las unidades de cada organismo que participan en el ejercicio de la competencia, ya que esta información será utilizada más adelante en tu formulario.</h6>
        
        <div className="my-4">
            {Object.entries(agrupados).map(([organismoDisplay, ministerios]) => (
              <div key={organismoDisplay} className="tabla-organismo">
                <div className="row border">
                  <div className="col-2 border">
                    <p>{organismoDisplay}</p>
                  </div>

                  <div className="col-10 border">
                    {Object.entries(ministerios).map(([ministerio, unidades]) => (
                        <div key={ministerio} className="tabla-organismo">
                        <div className="row border">
                          <div className="col p-3">
                            <p>{ministerio}</p>
                          </div>

                          <div className="col-10 border p-2">
                            {unidades.map((unidad, unidadIndex) => (
                              <div key={unidad.id} className="border row">
                                <div className="col-10 p-3">
                                  <div className="conteo">{unidadIndex + 1}</div>
                                  <CustomInput
                                    label="Nombre"
                                    value={unidad.nombre_unidad || ''}
                                    placeholder="Nombre ministerio o servicio"
                                    maxLength={300}
                                    onChange={(e) => handleInputChange(organismoDisplay, unidad.id, 'nombre_unidad', e.target.value)}
                                    onBlur={() => handleSave(unidad.id, organismoDisplay)}
                                  />                                  
                                    <CustomInput
                                      label="Descripción"
                                      value={unidad.descripcion_unidad || ''}
                                      placeholder="Descripción"
                                      maxLength={300}
                                      onChange={(e) => handleInputChange(organismoDisplay, unidad.id, 'descripcion_unidad', e.target.value)}
                                      onBlur={() => handleSave(unidad.id, organismoDisplay)}
                                    />
                                </div>
                                
                                  <div className="col d-flex align-items-center">
                                    <button
                                      className="btn-terciario-ghost">
                                      <i className="material-symbols-rounded me-2">delete</i>
                                      <p className="mb-0 text-decoration-underline">Borrar</p>
                                    </button>
                                  </div>
                              </div>
                            ))}
                              <div className="row">
                                <div className="p-2">
                                  <button
                                    className="btn-secundario-s m-2">
                                    <i className="material-symbols-rounded me-2">add</i>
                                    <p className="mb-0 text-decoration-underline">Agregar Otro</p>
                                  </button>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  };