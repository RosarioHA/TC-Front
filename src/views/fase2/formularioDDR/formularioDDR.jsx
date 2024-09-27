import { useState, useEffect, useRef } from 'react';
import { SubirArchivo } from '../../../components/fase1/commons/subirArchivo'

const FormularioDDR = () => {
  const [ errorMessageDate, setErrorMessageDate ] = useState('');
  const [ fechaInicio, setFechaInicio ] = useState('');
  const [ fechaMaxima, setFechaMaxima ] = useState('');

  useEffect(() => {
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
    setFechaMaxima(fechaActual);
  }, []);

  const dateInputRef = useRef(null);

  const handleFechaInicioChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    if (selectedDate > formattedToday) {
      setErrorMessageDate("La fecha no puede ser posterior a la fecha actual.");
      event.target.value = formattedToday;
      setFechaInicio(formattedToday);
    } else {
      setErrorMessageDate("");
      setFechaInicio(selectedDate);
    }
  };
    
  return (
    <div className="container"> 
      <div className="col-11">

        {/* primera seccion */}
        <div>
          <div className="d-flex mb-3">
            <h4 className="text-sans-h4">Publicación diario oficial</h4>
            <div className="ms-5">AVANCE</div>
          </div>

          <h5 className="text-sans-h5 mb-0">Adjunta la publicación del diario oficial correspondiente al proceso (Obligatorio)</h5>
          <h6 className="text-sans-h6">(Máximo 1 archivo, peso máximo 20 MB, formato PDF)</h6>

          <div>
            <div className="d-flex justify-content-between py-3 fw-bold">
              <div className="d-flex mb-2">
                <div className="ms-2">#</div>
                <div className="ms-5">Documento</div>
              </div>
              <div className="me-5">Acción</div>
            </div>
            <SubirArchivo
            index="1"
            readOnly={false}
            />
          </div>

          <div className="mt-5">
            <span className="text-sans-h5">Elige la fecha de la publicación (Obligatorio)</span>
            <div className="my-3 col-8">
              <input
              ref={dateInputRef}
              onClick={() => dateInputRef.current?.click()}
              id="dateInput"
              type="date"
              className="form-control py-3 my-2 border rounded border-dark-subtle"
              onChange={handleFechaInicioChange}
              value={fechaInicio}
              max={fechaMaxima}
              />
            </div>
            {errorMessageDate && (
              <p className="text-sans-h6-darkred mt-1 mb-0">{errorMessageDate}</p>
            )}
          </div>
        </div>

        {/* segunda seccion */}
        <div>
            
        </div>
        
          
      </div> 
    </div>
  )
}
  
export default FormularioDDR;