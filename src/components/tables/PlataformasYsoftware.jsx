import CustomInput from "../forms/custom_input";
import CustomTextarea from "../forms/custom_textarea";
import DropdownSelect from "../dropdown/select";
import {RadioButtons} from "../forms/radio_btns"

const PlataformasYsoftware = () => {
  return(
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
  )
};

export default PlataformasYsoftware;