import CustomTextarea from "../forms/custom_textarea";

const SumatoriaCostos = ({numFilas, readOnly}) => {
  const filas = Array.from({length: numFilas}, (_, index) => index + 1)
  return (
    <div>
      {/* Encabezado */}
      <div className="ps-3 my-4">
        <div className="d-flex justify-content-between py-3 fw-bold">
          <div className="col-2">
            <p className="text-sans-p-bold mb-0 mt-1">Subtítulo</p>
          </div>
          <div className="col">
            <p className="text-sans-p-bold mb-0 mt-1">Total Anual (M$)</p>
          </div>
          <div className="col-7 d-flex">
            <p className="text-sans-p-bold mb-0 mt-1">Descripción</p>
            <p className="text-sans-p ms-2 mb-0">(Opcional)</p>
          </div> 
        </div>

        {/* filas, se tienen que generar dinamicamente segun los costos elegidos en a. y b., enumerados por subtitulo */}
        {filas.map((fila, index) => (
          <div 
          key={fila} 
          className={`row ${index % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
            <div className="d-flex justify-content-between py-3 fw-bold">
              <div className="col-2">
                {/* numero del subtitulo, viene de la seleccion anterior */}
                <p className="text-sans-p-bold mb-0 mt-3 ms-4">21</p>
              </div>
              <div className="col">
                {/* valor del subtitulo, viene de la seleccion anterior */}
                <p className="text-sans-p-bold mb-0 mt-3 ms-5">-</p>
              </div>
              <div className="col-7 ps-2 d-flex">
                <CustomTextarea
                placeholder="Describe el costo por subtítulo."
                maxLength={300}
                readOnly={readOnly}/>
              </div> 
            </div>
          </div>
        ))}
        

        {/* fila de resultados, sumatoria de costos totales */}
        <div className={`row ${numFilas % 2 === 0 ? 'neutral-line' : 'white-line'} align-items-center me-3`}>
          <div className="d-flex justify-content-between py-3 fw-bold">
            <div className="col-2">
              <p className="text-sans-p-bold mb-0 mt-3 ms-4">Costos <br/> totales</p>
            </div>
            <div className="col">
              {/* sumatoria de los valores de todos los subtitulos de la tabla */}
              <p className="text-sans-p-bold mb-0 mt-3 ms-5">-</p>
            </div>
            <div className="col-7 ps-2 d-flex">
              <CustomTextarea
              placeholder="Describe el costo total."
              maxLength={300}
              readOnly={readOnly} />
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default SumatoriaCostos;