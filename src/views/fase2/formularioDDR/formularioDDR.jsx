import { useState, useEffect, useRef } from 'react';
import { SubirArchivo } from '../../../components/fase1/commons/subirArchivo';
import CustomInput from '../../../components/fase1/forms/custom_input';
import DropdownSelect from '../../../components/fase1/dropdown/select';

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
          <div className="d-flex mb-3">
            <h4 className="text-sans-h4">Fecha y plazos de implementación</h4>
            <div className="ms-5">AVANCE</div>
          </div>

          <div className="border row my-3 ms-1">
            <div className="col-2">
              <p>Grupo #</p>
            </div>
            <div className="col border-start p-3">
              <p className="text-sans-m-semibold mb-3">Regiones del grupo</p>
              <ul className="">
                <li className="text-decoration-underline">region 1</li>
                <li className="text-decoration-underline">region 2</li>
              </ul>

              <p className="text-sans-m-semibold mt-2 my-3">Fecha de comienzo de implementación</p>
              <div className="my-2">mostrar fecha publicacion diario oficial o mensaje de aviso -Debes ingresar la fecha de la publicación en el diario oficial primero-</div>

              <p className="text-sans-m-semibold my-3 mb-4">Meses de duración de la etapa de implementación</p>
              <div className="col">
                {/* ajustar para fecha igual que el input de la fecha diario oficial */}
                <CustomInput
                label="Ingresa la cantidad de meses"
                placeholder="Meses"
                />
                <p className="text-sans-h6 text-end me-4 me-xxl-5">Campo númerico.</p>
              </div>
            </div>
          </div>
        </div>

        {/* tercera seccion */}
        <div>
          <div className="d-flex mb-3">
            <h4 className="text-sans-h4">Fecha y plazo de Seguimiento</h4>
            <div className="ms-5">AVANCE</div>
          </div>

          <div className="border row my-3 ms-1">
            <div className="col-2">
              <p>Grupo #</p>
            </div>

            <div className="col border-start p-3">
              <p className="text-sans-m-semibold mb-3">Regiones del grupo</p>
              <ul className="">
                <li className="text-decoration-underline">region 1</li>
                <li className="text-decoration-underline">region 2</li>
              </ul>

              <p className="text-sans-m-semibold mt-2 my-3">Fecha de entrega de informe de seguimiento</p>
              <DropdownSelect 
              label="Elige la fecha límite de entrega del informe de seguimiento (Obligatorio)"
              placeholder="Elije una fecha"
              />
              <div className="d-flex mb-3 mt-1 text-sans-h6-primary">
                <i className="material-symbols-rounded me-2">info</i>
                <h6 className="mt-1">Luego de esta fecha, GORE podrá responder el informe pero será catalogado como atrasado.</h6>
              </div>

              <div className="col">
                <CustomInput
                label="Días corridos al pasado  (Obligatorio)"
                placeholder="Escribe el número de días"
                />
                <p className="text-sans-h6 text-end me-4 me-xxl-5">Campo númerico.</p>
              </div>
              
              <p className="text-sans-m-semibold mt-2 my-3">Fecha de apertura del informe de seguimiento</p>
              <div className="my-2">mostrar fecha publicacion diario oficial o mensaje de aviso -Debes ingresar la fecha límite de entrega del informa primero-</div>
              
            </div>
          </div>
        </div>

        {/* cuarta seccion */}
        <div>
          <h4 className="text-sans-h4">Evaluación</h4>
          <h6 className="text-sans-h6-primary mt-1">Etapa aun no disponible en la plataforma.</h6>
        </div>
        
      </div> 
    </div>
  )
}
  
export default FormularioDDR;