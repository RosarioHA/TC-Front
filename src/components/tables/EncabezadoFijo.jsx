import React, { useState, useEffect } from 'react';
import CustomInput from '../forms/custom_input';
import DropdownSelect from '../dropdown/select'

const TablaEncabezadoFijo = ({ data, options }) => {

  console.log('ops',options)

  // Estado para mantener los datos agrupados por organismo
  const [organismosAgrupados, setOrganismosAgrupados] = useState({});

  // Estado para manejar el nuevo organismo seleccionado del dropdown
  const [nuevoOrganismo, setNuevoOrganismo] = useState('');

  // Generar un array de strings únicos para los posibles organismos
  const posiblesOrganismos = [...new Set(data.map(item => item.organismo_display))];

  // Efecto para agrupar datos cada vez que 'data' cambia
  useEffect(() => {
    agruparOrganismos(data);
  }, [data]);

  // Función para agrupar los datos por organismo_display
  const agruparOrganismos = (datos) => {
    const agrupados = datos.reduce((acc, item) => {
      const displayKey = item.organismo_display; 
      acc[displayKey] = acc[displayKey] || [];
      acc[displayKey].push(item);
      return acc;
    }, {});

    // Ordenar para que 'MIN' sea el primero, si existe
    const ordenados = {};
    if (agrupados['MIN']) {
      ordenados['MIN'] = agrupados['MIN'];
    }
    Object.keys(agrupados).forEach(key => {
      if (key !== 'MIN') {
        ordenados[key] = agrupados[key];
      }
    });

    setOrganismosAgrupados(ordenados);
  };

  // Función para agregar una nueva fila a un organismo
  const agregarFila = (organismoDisplay) => {
    const nuevaFila = { id: Date.now(), nombre_ministerio_servicio: '', descripcion: '' };
    setOrganismosAgrupados(prevOrganismos => ({
      ...prevOrganismos,
      [organismoDisplay]: [...prevOrganismos[organismoDisplay], nuevaFila]
    }));
  };

  // Función para eliminar una fila de un organismo
  const eliminarFila = (organismoDisplay, id) => {
    // Obtener las filas del organismo actual
    const filasActuales = organismosAgrupados[organismoDisplay];
  
    // Verificar si el organismo tiene sólo un subítem
    if (filasActuales.length === 1) {
      // Eliminar el organismo completo si sólo tiene un subítem
      setOrganismosAgrupados(prevOrganismos => {
        const nuevosOrganismos = { ...prevOrganismos };
        delete nuevosOrganismos[organismoDisplay];
        return nuevosOrganismos;
      });
    } else {
      // Eliminar sólo la fila específica si hay más de un subítem
      setOrganismosAgrupados(prevOrganismos => ({
        ...prevOrganismos,
        [organismoDisplay]: prevOrganismos[organismoDisplay].filter(fila => fila.id !== id)
      }));
    }
  };  

  // Función para agregar un nuevo organismo
  const agregarNuevoOrganismo = () => {
    if (nuevoOrganismo && !organismosAgrupados[nuevoOrganismo]) {
      setOrganismosAgrupados(prevOrganismos => ({
        ...prevOrganismos,
        [nuevoOrganismo]: [{ id: Date.now(), nombre_ministerio_servicio: '', descripcion: '' }]
      }));
    }
  };

  return (
    <div className="my-4">
      {/* Renderiza las tablas para cada organismo */}
      {Object.entries(organismosAgrupados).map(([organismoDisplay, filas], index) => (
        <div key={index} className="tabla-organismo">
          <div className="row border">
            <div className="col p-3">
              <p>{organismoDisplay}</p>
            </div>
            <div className="col-10 border p-2">
            {filas.map((fila, filaIndex) => (
              <div key={fila.id} className="border row">
                <div className="col-10 p-3">
                  <div className="conteo">{filaIndex + 1}</div>
                  <CustomInput
                    label="Nombre"
                    value={fila.nombre_ministerio_servicio || ''}
                    placeholder="Nombre ministerio o servicio"
                    maxLength={index === 0 && filaIndex === 0 ? undefined : 300}
                    disabled={index === 0 && filaIndex === 0}
                  />
                  {filaIndex > 0 || fila.descripcion ? (
                    <CustomInput
                      label="Descripción"
                      value={fila.descripcion || ''}
                      placeholder="Descripción"
                      maxLength={300}
                    />
                  ) : null}
                </div>
                {index !== 0 || filaIndex !== 0 ? (
                  <div className="col d-flex align-items-center">
                    <button
                      className="btn-terciario-ghost"
                      onClick={() => eliminarFila(organismoDisplay, fila.id)}>
                      <i className="material-symbols-rounded me-2">delete</i>
                      <p className="mb-0 text-decoration-underline">Borrar</p>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
              <div className="row">
                <div className="p-2">
                  <button
                    className="btn-secundario-s m-2"
                    onClick={() => agregarFila(organismoDisplay)}>
                    <i className="material-symbols-rounded me-2">add</i>
                    <p className="mb-0 text-decoration-underline">Agregar Otro</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botón para agregar organismo */}             
      <button className="btn-secundario-s" onClick={nuevoOrganismo}>
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Organismo</p>
      </button>

      {/* Dropdown para seleccionar y agregar un nuevo organismo */}
      
    </div>
  );
};

export default TablaEncabezadoFijo;
