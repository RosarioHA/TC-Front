import { useState } from "react";
import CustomTextarea from "../../forms/custom_textarea";
import { DropdownSelectSimple } from "../../dropdown/selectSimple";

export const IndicadoresDesempeno = () => {
    // Estado para manejar las secciones de Indicadores de Desempeño
    const [secciones, setSecciones] = useState([1]); // Inicialmente una sección
  
    // Función para agregar una nueva sección
    const agregarSeccion = () => {
      setSecciones([...secciones, secciones.length + 1]);
    };
  
    // Renderización de cada sección dinámica
    const renderSeccion = (index) => (
      <div key={index} className="mx-1 border row">
        <div className="border-end col-1 p-3">{index}</div>
        <div className="col-11">
          <div className="row">
            <div className="row py-3">
              <div className="col-5 ps-4">
                <p className="text-sans-p-bold mb-0">Tipo de indicador</p>
                <p className="text-sans-h6 mb-0">(Obligatorio)</p>
              </div>
              <div className="col ps-4">
                <p className="text-sans-p-bold mb-0">Nombre del indicador</p>
                <p className="text-sans-h6 mb-0">(Obligatorio)</p>
              </div>
            </div>
            <div className="row neutral-line m-0 py-3">
              <div className="col-5">
                <DropdownSelectSimple />
              </div>
              <div className="col">
                <CustomTextarea
                  placeholder="Nombre del indicador"
                  maxLength="300"
                />
              </div>
            </div>
          </div>
  
          <div className="row">
            <div className="row py-3">
              <div className="col-5 ps-4">
                <p className="text-sans-p-bold mb-0">Tipo de Cálculo</p>
                <p className="text-sans-h6 mb-0">(Obligatorio)</p>
              </div>
              <div className="col ps-4">
                <p className="text-sans-p-bold mb-0">Fórmula del indicador</p>
                <p className="text-sans-h6 mb-0">(Obligatorio)</p>
              </div>
            </div>
            <div className="row neutral-line m-0 py-3">
              <div className="col-5">
                <DropdownSelectSimple />
              </div>
              <div className="col">COMPONENTE QUE CAMBIA SEGÚN SELECCIÓN</div>
            </div>
          </div>
  
          <div className="row mt-3 py-3">
            <CustomTextarea
              label="Verificador (Obligatorio)"
              placeholder="Describe el indicador de desempeño"
              maxLength="300"
            />
          </div>
        </div>
      </div>
    );
  
    return (
      <div className="mb-4 col-11">
        <h4 className="text-sans-h4 mb-3">4.5a Indicadores de desempeño</h4>
  
        {/* Renderizar todas las secciones */}
        {secciones.map((seccion, index) => renderSeccion(index + 1))}
  
        {/* Botón para agregar una nueva sección */}
        <button className="btn-secundario-s mt-3" onClick={agregarSeccion}>
          <i className="material-symbols-rounded me-2">add</i>
          <p className="mb-0 text-decoration-underline">Agregar Indicador</p>
        </button>
      </div>
    );
  };