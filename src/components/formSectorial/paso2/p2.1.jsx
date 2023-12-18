
export const Subpaso_dosPuntoUno = () => {
  return(
    <div>
      <h4 className="text-sans-h4">2.1 Organismos intervinientes en el ejercicio de la competencia</h4>
      <h6 className="text-sans-h6-primary">En esta sección se debe describir brevemente, según corresponda, la esfera de atribuciones que posee cada organismo que cumpla un rol en el ejercicio de la competencia. Si las atribuciones de los organismos no están establecidas por ley, o el organismo no tiene un rol en el ejercicio de la competencia, la casilla de descripción debe quedar vacía. </h6>
      <h6 className="text-sans-h6-primary mt-3">Asegúrate de identificar correctamente los organismos intervinientes, ya que esta información será utilizada más adelante en tu formulario.</h6>

      <div className="my-4">
        <div className="row border">
          <div className="col-2">
            <p>Ministerio o Servicio Público</p>
          </div>
          <div className="col-10 border">
            <div className="row border p-3">
              <div className="campo-container p-2">
                <p className="ms-2 my-2">$SectorPreseleccionado</p>
              </div>
            </div>
            <div className="row">
              <div className="p-2">
                <button className="btn-secundario-s">
                  <i className="material-symbols-rounded me-2">add</i>
                  <p className="mb-0 text-decoration-underline">Agregar Otro</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-secundario-s">
        <i className="material-symbols-rounded me-2">add</i>
        <p className="mb-0 text-decoration-underline">Agregar Organismo</p>
      </button>
    </div>
  )
};