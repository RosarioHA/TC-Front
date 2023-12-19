import CustomInput from "../forms/custom_input";
import DropdownSelect from "../dropdown/select";

const EtapasYprocedimientos = () => {
  return(
    <div className="row border my-4">
        <div className="col-1 border">
          <p className="text-sans-p-bold mb-0">Etapa 1</p> 
        </div>
        <div className="col">
          <div className="row border">
            <div className="col-2 p-2">
              <p className="text-sans-p-bold mb-0">Nombre de la etapa</p>
              <p className="text-sans-p-grayc">(Opcional)</p>
            </div>
            <div className="col p-2">
              <CustomInput 
              placeholder="Escribe el nombre de la etapa"
              maxLength={500}/>
            </div>
          </div>

          <div className="row border">
            <div className="col-2 p-2">
              <p className="text-sans-p-bold mb-0">Descripción de la etapa</p>
              <p className="text-sans-p-grayc">(Opcional)</p>
            </div>
            <div className="col p-2">
              <CustomInput 
              placeholder="Describe la etapa"
              maxLength={500}/>
            </div>
          </div>
            
          <div className="row border">
            <div className="d-flex p-2">
              <p className="text-sans-p-bold mb-0 me-2">Procedimientos</p>
              <p className="text-sans-p-grayc me-3">(Opcional)</p>
              <button className="btn-secundario-s">
                 <i className="material-symbols-rounded me-2">add</i>
                <p className="mb-0 text-decoration-underline">Agregar Procedimiento</p>
              </button>
            </div>
          </div>

          <div className="row border p-2">
            <p className="col-1">1</p>
            <div className="col ms-4 mt-3">
              <CustomInput 
              label="Descripción del procedimiento (Obligatorio)"
              placeholder="Describe el procedimiento"
              maxLength={500}/>
            </div>
            <div className="col ms-4 mt-3">
              <DropdownSelect 
              label="Unidades Intervinientes"
              placeholder="Unidades"
              //name={pasoData.ambito}
              options=""/>
            </div>
          </div>
        </div>
      </div>
  )
};

export default EtapasYprocedimientos;